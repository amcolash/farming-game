import { DayNight } from "./daynight";

export class ControllableCamera extends Phaser.Physics.Arcade.Image {
  camera: Phaser.Cameras.Scene2D.Camera;
  cursors: Phaser.Input.Keyboard.CursorKeys;
  readonly speed: number = 300;
  world: Phaser.Physics.Arcade.World;

  daynight: DayNight;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'crops', 1);
    scene.physics.add.existing(this);

    this.world = scene.physics.world;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.camera = scene.cameras.main;
    this.camera.startFollow(this, true, 0.1, 0.1);
    this.camera.setZoom(__DEV__ ? 0.7 : 1.3);

    this.setCollideWorldBounds(true);

    scene.game.events.addListener('zoom', (zoom) => {
      this.camera.setZoom(Phaser.Math.Clamp(this.camera.zoom + zoom * 0.2, 0.7, 3));
    });

    const width = Number.parseInt(scene.game.config.width.toString());
    const height = Number.parseInt(scene.game.config.height.toString());
    if (!__DEV__) this.daynight = new DayNight(scene, 0, 0, width * 4, height * 4);
  }

  update() {
    if (this.daynight) this.daynight.update(this.x, this.y);
    this.setVelocity(0);
    
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;
    
    if (up && !down) this.setVelocityY(-this.speed * this.world.timeScale);
    if (!up && down) this.setVelocityY(this.speed * this.world.timeScale);
    
    if (left && !right) this.setVelocityX(-this.speed * this.world.timeScale);
    if (!left && right) this.setVelocityX(this.speed * this.world.timeScale);
    
    if (up || down || left || right) this.scene.game.events.emit('clearHover');
  }
}