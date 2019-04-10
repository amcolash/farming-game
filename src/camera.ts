export class Camera extends Phaser.Physics.Arcade.Image {
  camera: Phaser.Cameras.Scene2D.Camera;
  cursors: Phaser.Input.Keyboard.CursorKeys;
  readonly speed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'crops', 1);
    scene.physics.add.existing(this);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.camera = scene.cameras.main;
    this.camera.startFollow(this, true, 0.1, 0.1);
    this.camera.setZoom(1.5);

    this.setCollideWorldBounds(true);

    scene.game.events.addListener('zoom', (zoom) => {
      this.camera.setZoom(Phaser.Math.Clamp(this.camera.zoom + zoom * 0.2, 0.8, 3));
    });
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