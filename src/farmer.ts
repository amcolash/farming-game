import { Crops } from './crops';
import { Farm } from './farm';
import { Land, LandState } from './land';

export enum FarmerType {
  ALL,
  PLANT,
  HARVEST
}

export class Farmer extends Phaser.GameObjects.Container {
  readonly baseMoney: number = 200;

  farmerType: FarmerType;
  farm: Farm;
  spawnLocation: Phaser.Math.Vector2;
  registry: Phaser.Data.DataManager;
  wait: number;
  world: Phaser.Physics.Arcade.World;

  constructor(scene: Phaser.Scene, x: number, y: number, farm: Farm, type: FarmerType) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.farmerType = type;
    this.farm = farm;
    this.spawnLocation = new Phaser.Math.Vector2(x, y);
    this.registry = scene.game.registry;
    this.world = scene.physics.world;

    this.add(new Phaser.GameObjects.Arc(scene, 0, 12, 4, 0, 360, false, type == FarmerType.ALL ? 0xff0000 : (type == FarmerType.HARVEST ? 0x00ff00 : 0x0000ff)));
    this.add(new Phaser.GameObjects.Image(scene, 0, 0, 'crops', 20));
  }

  update(time: number, delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    
    if (this.wait > 0) {
      this.wait -= delta * (1 / this.world.timeScale);
      return;
    }

    if (this.isPlanter()) this.registry.set('currentCrop', this.getBestCrop());

    var tile = null;

    if (this.farmerType == FarmerType.ALL) {
      tile = this.getBestAllTile();
    } else if (this.isHarvester()) {
      tile = this.getBestHarvesterTile();
    } else if (this.isPlanter()) {
      tile = this.getBestPlanterTile();
    }

    if (tile !== null) {
      if (this.distance(tile) < 200) {
        switch(tile.land) {
          case LandState.EMPTY:
            this.wait = 100;
            break;
          case LandState.PLOWED:
            this.wait = 50;
            break;
          case LandState.READY:
            this.wait = 100;
            break;
        }

        this.wait *= (this.farmerType == FarmerType.ALL ? 1 : 0.75);
        if (this.canInteract(tile.land)) tile.handleClick();
      } else {
        this.scene.physics.moveTo(this, tile.sprite.x, tile.sprite.y, 60);
      }
    }
  }

  getBestHarvesterTile(): Land {
    if (this.farm.ready.getLength() > 0) {
      return this.getBestTile(LandState.READY);
    } else {
      return this.getBestTile(LandState.PLANTED);
    }
  }

  getBestPlanterTile(): Land {
    if (this.farm.plowed.getLength() > 0 && this.canAffordCrop()) {
      return this.getBestTile(LandState.PLOWED);
    } else {
      return this.getBestTile(LandState.EMPTY);
    }
  }

  getBestAllTile(): Land {
    if (this.farm.ready.getLength() > 0) {
      return this.getBestTile(LandState.READY);
    } else if (this.farm.plowed.getLength() > 0 && this.canAffordCrop()) {
      return this.getBestTile(LandState.PLOWED);
    } else if (this.canAffordPlow()) {
      return this.getBestTile(LandState.EMPTY);
    } else {
      return this.getBestTile(LandState.PLANTED);
    }
  }

  isPlanter(): boolean {
    return this.farmerType == FarmerType.ALL || this.farmerType == FarmerType.PLANT;
  }

  isHarvester(): boolean {
    return this.farmerType == FarmerType.ALL || this.farmerType == FarmerType.HARVEST;
  }

  canInteract(type: LandState): boolean {
    return (
      (type == LandState.EMPTY && this.isPlanter() && this.canAffordPlow()) ||
      (type == LandState.PLOWED && this.isPlanter() && this.canAffordCrop()) ||
      (type == LandState.READY && this.isHarvester())
    );
  }

  getBestCrop(): number {
    const money = this.registry.get('money');
    let best = 0;
    for (var i = 0; i < Crops.length; i++) {
      if (Crops[i].revenue > Crops[best].revenue && money - 3 * (Crops[i].cost + 5) >= this.baseMoney) best = i;
    }

    return best;
  }

  getBestTile(land: LandState): Land {
    var best = this.getClosestTile(land);

    switch(land) {
      case LandState.PLOWED:
        if (this.distance(best) > 5000) {
          best = this.getClosestTile(LandState.EMPTY);
        }
        break;
      case LandState.READY:
        if (this.farmerType == FarmerType.ALL) {
          var plowed = this.getClosestTile(LandState.PLOWED);
          if (plowed && this.distance(plowed) < 500 && this.canAffordCrop()) {
            best = plowed;
          } else {
            var empty = this.getClosestTile(LandState.EMPTY);
            if (empty && this.distance(empty) < 500 && this.canAffordPlow()) {
              best = empty;
            }
          }
        }
    }

    return best;
  }

  distance(tile: Land) {
    return Phaser.Math.Distance.Squared(this.x, this.y, tile.sprite.x, tile.sprite.y);
  }

  spawnDistance(tile: Land) {
    return Phaser.Math.Distance.Squared(this.spawnLocation.x, this.spawnLocation.y, tile.sprite.x, tile.sprite.y);
  }

  canAffordPlow(): boolean {
    const money = this.registry.get('money');
    return money > 5 + this.baseMoney;
  } 

  canAffordCrop(): boolean {
    const money = this.registry.get('money');
    return money > Crops[this.registry.get('currentCrop')].cost + this.baseMoney;
  }

  getClosestTile(land: LandState): Land {
    var arr;
    switch(land) {
      case LandState.PLOWED:
        arr = this.farm.plowed.getChildren();
        break;
      case LandState.PLANTED:
        arr = this.farm.planted.getChildren();
        break;
      case LandState.READY:
        arr = this.farm.ready.getChildren();
        break;
      case LandState.EMPTY:
        arr = this.farm.empty.getChildren();
        break;
    }

    var score = 9999999999;
    var best = null;

    if (arr) {
      for (var i = 0; i < arr.length; i++) {
        const tile = arr[i] as Land;
        const tmpScore = this.getScore(tile);
        if (tmpScore < score) {
          score = tmpScore;
          best = tile;
        }
      }
    }

    return best;
  }

  getScore(tile: Land) {
    var score = this.distance(tile);

    if (tile.land == LandState.READY) {
      score = ((score / 400) * score + tile.life * 500 - tile.crop.revenue * 500);
    } else if (tile.land == LandState.PLANTED) {
      score += tile.life * 5000;
    } else {
      score += this.spawnDistance(tile);
    }

    // Add random to try and prevent duplicate scores
    return score + Math.random();
  }
}