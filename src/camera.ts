export class Camera extends Phaser.Physics.Arcade.Image {
  cursors: Phaser.Input.Keyboard.CursorKeys;
  readonly speed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.physics.add.existing(this);
    scene.cameras.main.startFollow(this);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.setCollideWorldBounds(true);
  }

  update() {
    this.setVelocity(0);
    
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;
    
    if ((up && !down) || (!up && down)) {
      if (up) this.setVelocityY(-this.speed);
      if (down) this.setVelocityY(this.speed);
    }

    if ((left && !right) || (!left && right)) {
      if (left) this.setVelocityX(-this.speed);
      if (right) this.setVelocityX(this.speed);
    }
  }
}