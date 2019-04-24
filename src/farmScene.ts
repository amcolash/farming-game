import { Camera } from './camera';
import { Farm } from './farm';
import { Farmer, FarmerType } from './farmer';
import { Tooltip } from './tooltip';

export class FarmScene extends Phaser.Scene {
  camera: Camera;
  farm: Farm;

  farmers: Farmer[] = [];

  tooltip: Tooltip;

  constructor() {
    super('FarmScene');
  }
  
  create(): void {
    this.farm = new Farm(this);
    this.camera = new Camera(this, 0, 0);
    
    // TODO: Figure out dancing and fighting farmers
    // this.physics.add.collider(this.farmer, farmer1);
    this.farmers.push(new Farmer(this, 0, 0, this.farm, FarmerType.ALL));
    this.farmers.push(new Farmer(this, 32, 0, this.farm, FarmerType.PLANTER));
    this.farmers.push(new Farmer(this, 64, 0, this.farm, FarmerType.HARVESTER));
    
    this.tooltip = new Tooltip(this);

    // There is an issue with this, see: https://github.com/photonstorm/phaser/issues/4405
    // this.input.setPollAlways();
    // this.physics.world.timeScale = 1 / 5;

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
    this.tooltip.update();
    
    this.farm.update(time, delta);
    this.farmers.forEach(farmer => farmer.update(time, delta));

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