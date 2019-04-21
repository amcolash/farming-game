import "phaser";
import axios from "axios";
import * as moment from "moment";

import { Crops } from './crops';
import { FarmScene } from './farmScene';
import { HUDScene } from './hudScene';
import { LoadingScene } from './loadingScene';
import { ShopScene } from './shopScene';

const config: GameConfig = {
  title: 'Farming Game',
  width: 480,
  height: 720,
  parent: 'game',
  backgroundColor: '#000000',
  scene: [LoadingScene, FarmScene, HUDScene, ShopScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

export class FarmingGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);

    // Set up game data
    this.registry.set('currentCrop', 0);
    this.registry.set('life', 0);
    this.registry.set('money', 300);
    this.registry.set('profit', 0);
    this.registry.set('stats', new Array(Crops.length).fill(0));

    // Disable normal right click
    this.input.mouse.disableContextMenu();
  }
}

window.onload = () => {
  var game = new FarmingGame(config);
  getLog();
};

function getLog() {
  if (window.location.href.indexOf('localhost') !== -1) {
    const url = "https://api.github.com/repos/amcolash/farming-game/commits";
    axios.get(url).then(response => {
      const data = response.data.map(i => { return { date: moment(i.commit.author.date).fromNow(), message: i.commit.message }; });
  
      const logList = document.getElementsByTagName('ul')[0];
      data.forEach(commit => {
        const item = document.createElement('li');
        item.innerText = commit.date + ": " + commit.message;
  
        logList.appendChild(item);
      });
  
      document.getElementById('log').setAttribute('style', 'display: flex;');
    }).catch(err => {
      console.error(err);
    });
  }
}