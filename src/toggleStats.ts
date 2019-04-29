import { ToggleContainer } from "./toggleContainer";
import { Crops } from "./crops";

export class ToggleStats extends ToggleContainer {
  bars: Phaser.GameObjects.Rectangle[];

  constructor(scene: Phaser.Scene, width:number, height: number, clickHandler: () => void) {
    super(scene, -200, 0, height - 124);

    const statsBackground = new Phaser.GameObjects.Rectangle(scene, 0, 22, 200, 115, 0x000000, 0.35).setOrigin(0, 1);
    const statsToggle = new Phaser.GameObjects.Rectangle(scene, 200, 0, 42, 44, 0x000000, 0.35).setOrigin(0, 0.5);
    
    statsBackground.setInteractive().on('pointerover', () => scene.game.events.emit('clearHover'));
    statsToggle.setInteractive({ useHandCursor: true });
    statsToggle.on('pointerdown', clickHandler);
    statsToggle.on('pointerover', () => scene.game.events.emit('clearHover'));

    this.add(statsBackground);
    this.add(statsToggle);
    this.add(new Phaser.GameObjects.Sprite(scene, 204, 1, 'crops', 20).setOrigin(0, 0.5));

    this.bars = [];
    const sorted = Crops.sort((a, b) => { return a.frame - b.frame });
    for (var i = 0; i < sorted.length; i++) {
      const crop = sorted[i];
      
      const sprite = new Phaser.GameObjects.Sprite(scene, i * 32 + 20, 0, 'crops', crop.frame);
      this.add(sprite);

      const bar = new Phaser.GameObjects.Rectangle(scene, i * 32 + 20, -50, 8, 50, 0xcccccc);
      bar.setAngle(180);
      this.bars.push(bar);
      this.add(bar);
    }
  }

  doUpdate(time: number, delta: number): void {
    const stats = this.scene.game.registry.get('stats');
    const total = stats.reduce((a, v) => { return a + v; });
    for (var i = 0; i < Crops.length; i++) {
      if (total === 0) this.bars[i].height = 2;
      else this.bars[i].height = 2 + 47 * (stats[i] / total);
    }
  }
}