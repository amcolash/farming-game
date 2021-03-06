export class TextButton extends Phaser.GameObjects.Text {
  selected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string | string[], callback: () => void) {
    super(scene, x, y, text, { backgroundColor: '#0f0', fontSize: '24px' });

    this.setInteractive({ useHandCursor: true });
    this.on('pointerover', () => this.enterButtonHoverState());
    this.on('pointerout', () => this.enterButtonRestState());
    this.on('pointerdown', () => this.enterButtonActiveState());
    this.on('pointerup', () => {
      this.enterButtonHoverState();
      callback();
    });

    this.scene.add.existing(this);
  }

  enterButtonHoverState() {
    this.setStyle({ fill: this.selected ? '#fff' : '#ff0'});
  }

  enterButtonRestState() {
    this.setStyle({ fill: this.selected ? '#fff' : '#0f0' });
  }

  enterButtonActiveState() {
    this.setStyle({ fill: '#0ff' });
  }

  setSelected(selected: boolean) {
    this.selected = selected;
    this.enterButtonRestState();
    this.input.enabled = !selected;
  }
}