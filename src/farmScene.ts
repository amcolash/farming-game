import { Camera } from './camera';
import { Farm } from './farm';
import { Farmer } from './farmer';
import { Tooltip } from './tooltip';
import { FarmerType } from './farmerData';
import { DayNight } from './daynight';

export class FarmScene extends Phaser.Scene {
  paused: boolean = false;
  camera: Camera;
  farm: Farm;
  farmers: Farmer[] = [];
  tooltip: Tooltip;

  constructor() {
    super('FarmScene');
  }
  
  create(): void {
    this.farm = new Farm(this);
    // TODO: Figure out dancing and fighting farmers
    // this.physics.add.collider(this.farmer, farmer1);
    if (__DEV__) {
      this.farmers.push(new Farmer(this, 0, 0, this.farm, FarmerType.ALL));
      // this.farmers.push(new Farmer(this, 32, 0, this.farm, FarmerType.PLANTER));
      // this.farmers.push(new Farmer(this, 64, 0, this.farm, FarmerType.HARVESTER));
    } else {
      this.farmers.push(new Farmer(this, 0, 0, this.farm, FarmerType.ALL));
    }
    
    this.tooltip = new Tooltip(this);
    this.camera = new Camera(this, 0, 0);
    
    // There is an issue with this, see: https://github.com/photonstorm/phaser/issues/4405
    // this.input.setPollAlways();
    this.physics.world.timeScale = __DEV__ ? 1 / 15 : 1 / 5;

    this.game.events.on('speed', value => {
      let raw = value;
      if (value == 0) {
        this.paused = !this.paused;
        if (!this.paused) raw = 1 / this.physics.world.timeScale;
      } else {
        raw = Phaser.Math.Clamp((1 / this.physics.world.timeScale) + value, 1, 20);
        this.physics.world.timeScale = 1 / raw;
      }

      // Let HUD know final value
      this.game.events.emit('speedValue', raw.toFixed(0));
    });
  }

  update(time: number, delta: number): void {
    if (this.paused) delta = 0;

    this.game.registry.set('gameTime', this.game.registry.get('gameTime') + delta * (1 / this.physics.world.timeScale) * 500);

    this.camera.update();
    this.tooltip.update();
    
    // Actual game objects go inside
    if (delta > 0) {
      this.farm.update(time, delta);
      this.farmers.forEach(farmer => farmer.update(time, delta));
    }

    this.frustumCull();
  }

  // Frustum culling from: https://github.com/photonstorm/phaser/issues/4092
  frustumCull(): void {
    let children = this.children.getChildren();

    for (let child of children)
      (child as any).visible = false;

    let visible = this.cameras.main.cull(children);
    
    for (let child of visible)
      (child as any).visible = (child as any).alpha > 0;
  }
}