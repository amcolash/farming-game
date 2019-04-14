export class TextButton extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string | string[], callback: () => void) {
    super(scene, x, y, text, { fill: '#0f0', fontSize: 24 });

    this.setInteractive({ useHandCursor: true })
    this.on('pointerover', () => this.enterButtonHoverState() )
    this.on('pointerout', () => this.enterButtonRestState() )
    this.on('pointerdown', () => this.enterButtonActiveState() )
    this.on('pointerup', () => {
      this.enterButtonHoverState();
      callback();
    });

    this.scene.add.existing(this);
  }

  enterButtonHoverState() {
    this.setStyle({ fill: '#ff0'});
  }

  enterButtonRestState() {
    this.setStyle({ fill: '#0f0'});
  }

  enterButtonActiveState() {
    this.setStyle({ fill: '#0ff' });
  }
}