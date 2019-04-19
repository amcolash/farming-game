import { Camera } from './camera';
import { Farm } from './farm';
import { Farmer, FarmerType } from './farmer';

export class FarmScene extends Phaser.Scene {
  camera: Camera;
  farm: Farm;

  farmer1: Farmer;
  farmer2: Farmer;
  farmer3: Farmer;

  constructor() {
    super('FarmScene');
  }
  
  create(): void {
    this.farm = new Farm(this);
    this.camera = new Camera(this, 0, 0);
    
    // this.farmer1 = new Farmer(this, 0, 0, this.farm, FarmerType.ALL);
    this.farmer2 = new Farmer(this, 32, 0, this.farm, FarmerType.PLANT);
    this.farmer3 = new Farmer(this, 64, 0, this.farm, FarmerType.HARVEST);

    // TODO: Figure out dancing and fighting farmers
    // const farmer1 = new Farmer(this, 350, 350, this.farm);
    // this.physics.add.collider(this.farmer, farmer1);

    this.physics.world.timeScale = 1 / 5;

    this.game.events.on('speed', value => {
      const raw = Phaser.Math.Clamp((1 / this.physics.world.timeScale) + value, 1, 25);
      this.physics.world.timeScale = 1 / raw;

      // Let HUD know final value
      this.game.events.emit('speedValue', raw.toFixed(0));
    });
  }

  update(time: number, delta: number): void {
    this.game.registry.set('life', this.game.registry.get('life') + delta * (1 / this.physics.world.timeScale));

    this.camera.update();
    
    this.farm.update(time, delta);

    if (this.farmer1) this.farmer1.update(time, delta);
    if (this.farmer2) this.farmer2.update(time, delta);
    if (this.farmer3) this.farmer3.update(time, delta);
  }
}