import { Crops } from './crops';
import { Farm } from './farm';
import { Land, LandState } from './land';

export class Farmer extends Phaser.GameObjects.Container {
  readonly baseMoney: number = 200;

  farm: Farm;
  registry: Phaser.Data.DataManager;

  constructor(scene: Phaser.Scene, x: number, y: number, farm: Farm) {
    super(scene, x, y);
    this.add(new Phaser.GameObjects.Arc(scene, x, y + 12, 4, 0, 360, false, 0xff0000));
    this.add(new Phaser.GameObjects.Image(scene, x, y, 'crops', 20));

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.farm = farm;
    this.registry = scene.game.registry;
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    
    var tile = null;
    if (this.farm.ready.getLength() > 0) {
      tile = this.getBestTile(LandState.READY);
    } else if (this.farm.plowed.getLength() > 0 && this.canAffordCrop()) {
      tile = this.getBestTile(LandState.PLOWED);
    } else if (this.canAffordPlow()) {
      tile = this.getBestTile(LandState.EMPTY);
    } else {
      tile = this.getBestTile(LandState.PLANTED);
    }

    if (tile !== null) {
      if (this.distance(tile) < 200) {
        tile.handleClick();
      } else {
        this.scene.physics.moveTo(this, tile.sprite.x, tile.sprite.y, 60 * this.registry.get('speed'));
      }
    }
  }

  getBestTile(land: LandState): Land {
    var best = this.getClosestTile(land);

    switch(land) {
      case LandState.PLOWED:
        if (this.distance(best) > 5000) {
          best = this.getClosestTile(LandState.EMPTY);
        }
        break;
      case LandState.READY:
        var plowed = this.getClosestTile(LandState.PLOWED);
        if (plowed && this.distance(plowed) < 500 && this.canAffordCrop()) {
          best = plowed;
        } else {
          var empty = this.getClosestTile(LandState.EMPTY);
          if (empty && this.distance(empty) < 500 && this.canAffordPlow()) {
            best = empty;
          }
        }
    }

    return best;
  }

  distance(tile: Land) {
    return Phaser.Math.Distance.Squared(this.x, this.y, tile.sprite.x, tile.sprite.y);
  }

  canAffordPlow(): boolean {
    const money = this.registry.get('money');
    return money > 5 + this.baseMoney;
  } 

  canAffordCrop(): boolean {
    const money = this.registry.get('money');
    return money > Crops[this.registry.get('currentCrop')].cost + this.baseMoney;
  }

  getClosestTile(land: LandState): Land {
    var arr;
    switch(land) {
      case LandState.PLOWED:
        arr = this.farm.plowed.getChildren();
        break;
      case LandState.PLANTED:
        arr = this.farm.planted.getChildren();
        break;
      case LandState.READY:
        arr = this.farm.ready.getChildren();
        break;
      default:
        arr = this.farm.empty.getChildren();
        break;
    }

    this.scene.game.events.emit('planted', this.farm.planted.getLength() + this.farm.ready.getLength());

    var score = 9999999999;
    var best = null;
    for (var i = 0; i < arr.length; i++) {
      const tile = arr[i] as Land;
      const tmpScore = this.getScore(tile);
      if (tmpScore < score) {
        score = tmpScore;
        best = tile;
      }
    }

    return best;
  }

  getScore(tile: Land) {
    var score = this.distance(tile);

    if (tile.land == LandState.READY) {
      score = ((score / 400) * score + tile.life * 500 - tile.crop.revenue * 500);
    } else if (tile.land == LandState.PLANTED) {
      score = (score + tile.life * 5000);
    }

    return score;
  }
}