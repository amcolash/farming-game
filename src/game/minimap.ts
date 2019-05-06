import { FarmScene } from "../scenes/farmScene";
import { Land, LandState } from "../farm/land";
import { Farm } from "../farm/farm";

export class Minimap extends Phaser.GameObjects.Container {
  farmScene: FarmScene;
  farm: Land[][];
  rectangles: Phaser.GameObjects.Rectangle[][];
  
  constructor(scene: Phaser.Scene, farmScene: FarmScene, squareDimensions: number) {
    super(scene);
    scene.add.existing(this);
    this.setScale(squareDimensions / (Farm.dimensionX * 2 * Farm.tileSize)); // assuming that the farm is square
    
    this.farmScene = farmScene;
    this.farm = farmScene.farm.farm;
    
    const background = new Phaser.GameObjects.Rectangle(this.scene, Farm.dimensionX * Farm.tileSize, Farm.dimensionY * Farm.tileSize, Farm.dimensionX * 2 * Farm.tileSize, Farm.dimensionY * 2 * Farm.tileSize, 0x666666);
    this.add(background);
    background.setInteractive({ cursor: 'default' }).on('pointerover', () => this.scene.game.events.emit('clearHover'));

    this.rectangles = [];
    for (var x = 0; x < this.farm.length; x++) {
      const column = this.farm[x];
      this.rectangles[x] = [];
      for (var y = 0; y < column.length; y++) {
        const tile = column[y];
        const rectangle = new Phaser.GameObjects.Rectangle(this.scene,
          Farm.dimensionX * Farm.tileSize + tile.sprite.x + Farm.tileSize / 2, Farm.dimensionY * Farm.tileSize + tile.sprite.y + Farm.tileSize / 2,
          Farm.tileSize, Farm.tileSize, this.getColor(tile));
        this.add(rectangle);
        this.rectangles[x][y] = rectangle;
      }
    }
  }

  preUpdate(time: number, delta: number) {
    for (var x = 0; x < this.farm.length; x++) {
      const column = this.farm[x];
      for (var y = 0; y < column.length; y++) {
        const tile = column[y];
        if (tile.land == LandState.EMPTY) { // && tile.health > 0.85) {
          this.rectangles[x][y].setVisible(false);
        } else {
          this.rectangles[x][y].setVisible(true);
          if (this.rectangles[x][y].fillColor !== this.getColor(tile)) {
            this.rectangles[x][y].setFillStyle(this.getColor(tile));
          }
        }
      }
    }

    this.farmScene.farmers.forEach(farmer => {
      const lowerX = Math.floor((farmer.x + Farm.tileSize / 2) / Farm.tileSize) + Farm.dimensionX;
      const lowerY = Math.floor((farmer.y + Farm.tileSize / 2) / Farm.tileSize) + Farm.dimensionY;
      // console.log(lowerX, lowerY);
      this.rectangles[lowerX][lowerY].setVisible(true);
      this.rectangles[lowerX][lowerY].fillColor = 0xff00ff;
    });

    // this.rectangles[14][13].fillColor = 0xffffff;
  }

  getColor(tile: Land): number {
    switch(tile.land) {
      case LandState.EMPTY:
        var value = 80 * ((tile.health - 0.6) * (1 / (1 - 0.6))) + 40;
        return Phaser.Display.Color.GetColor(value, value, value);
      case LandState.PLOWED:
        return 0x0000ff;
      case LandState.PLANTED:
        return 0x00ff00;
      case LandState.READY:
        return 0xff0000;
    }
  }
}