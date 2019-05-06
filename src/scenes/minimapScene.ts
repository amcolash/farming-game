import { Minimap } from "../game/minimap";
import { FarmScene } from "./farmScene";
import { Farm } from "../farm/farm";

export class MinimapScene extends Phaser.Scene {
  farmScene: FarmScene;

  constructor() {
    super('MinimapScene');
  }

  create(): void {
    this.farmScene = this.game.scene.getScene('FarmScene') as FarmScene;
    
    const squareDimensions = 128;
    new Minimap(this, this.farmScene, squareDimensions);
    this.cameras.main.setViewport(8, 8, squareDimensions, squareDimensions);
  }
}