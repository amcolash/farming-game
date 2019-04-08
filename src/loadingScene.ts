export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('Loading');
  }

  loadAssets(): void {
    this.load.spritesheet('crops', 'assets/images/crops.png', { frameWidth: 32, frameHeight: 32 });
  }
  
  preload(): void {
    const width = Number.parseInt(this.game.config.width.toString());
    const height = Number.parseInt(this.game.config.height.toString());

    let text = this.add.text(width / 2, height / 2 - 50, 'Loading...', { fontSize: 32 });
    text.setAlign('center');
    text.setOrigin(0.5, 0.5);

    this.loadAssets();

    this.load.on('complete', () => {
      this.scene.start('FarmScene');
      this.scene.start('HUDScene');
    });
  }
}