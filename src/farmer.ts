import { Crop, Crops } from './crops';
import { Farm } from './farm';
import { Land, LandState } from './land';

export enum FarmerType {
  ALL,
  PLANT,
  HARVEST
}

export interface FarmerData {
  type: FarmerType;
  cost: number;
  text: string;
}

export let Farmers: FarmerData[] = [
  {
    type: FarmerType.ALL,
    cost: 10000,
    text: 'An all around hard worker who plants and harvests crops'
  },
  {
    type: FarmerType.PLANT,
    cost: 8500,
    text: 'A farmer who specializes in only planting crops'
  },
  {
    type: FarmerType.HARVEST,
    cost: 8500,
    text: 'A farmer who specializes in only harvesting crops'
  }
]

export class FarmerStats {
  harvestSpeed: number;
  movementSpeed: number;
  plantSpeed: number;
  plowSpeed: number;

  constructor(farmer: Farmer) {
    var rndNums;
    switch (farmer.farmerType) {
      case FarmerType.HARVEST:
        rndNums = 1;
        break;
      case FarmerType.PLANT:
        rndNums = 2;
        break;
      default:
        rndNums = 3;
        break;
    }

    var rnd = [];
    var extra = 0.5;
    var finalVal = extra;
    for (var i = 0; i < rndNums; i++) {
      rnd.push(Math.random() * (extra / rndNums));
      finalVal -= rnd[i];
    }

    switch (farmer.farmerType) {
      case FarmerType.HARVEST:
        this.harvestSpeed = 1 + rnd[0];
        break;
      case FarmerType.PLANT:
        this.plantSpeed = 1 + rnd[0];
        this.plowSpeed = 1 + rnd[1];
        break;
      default:
        this.harvestSpeed = 1 + rnd[0];
        this.plantSpeed = 1 + rnd[1];
        this.plowSpeed = 1 + rnd[2];
        break;
    }

    this.movementSpeed = 1 + finalVal;
  }
}

export class Farmer extends Phaser.GameObjects.Container {
  readonly baseMoney: number = 200;

  bestCrop: Crop;
  cropImage: Phaser.GameObjects.Image;
  farmerType: FarmerType;
  farm: Farm;
  spawnLocation: Phaser.Math.Vector2;
  stats: FarmerStats;
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
    this.stats = new FarmerStats(this);
    this.registry = scene.game.registry;
    this.world = scene.physics.world;

    this.add(new Phaser.GameObjects.Arc(scene, 0, 12, 4, 0, 360, false, type == FarmerType.ALL ? 0xff0000 : (type == FarmerType.HARVEST ? 0x00ff00 : 0x0000ff)));
    this.add(new Phaser.GameObjects.Sprite(scene, 0, 0, Farmer.getSprite(type), 0));

    if (this.isPlanter()) {
      this.bestCrop = this.getBestCrop();
      this.cropImage = new Phaser.GameObjects.Sprite(scene, 0, -32, 'crops', this.bestCrop.frame);
      this.add(this.cropImage);
    }
  }

  static getSprite(type: FarmerType): string {
    switch (type) {
      case FarmerType.ALL: return 'farmer_a';
      case FarmerType.HARVEST: return 'farmer_b';
      case FarmerType.PLANT: return 'farmer_c';
    }
  }

  update(time: number, delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    
    if (this.wait > 0) {
      this.wait -= delta * (1 / this.world.timeScale);
      return;
    }

    if (this.isPlanter()) {
      this.bestCrop = this.getBestCrop();
      this.cropImage.setFrame(this.bestCrop.frame);
    }

    var tile: Land = null;
    if (this.farmerType == FarmerType.ALL) {
      tile = this.getBestAllTile();
    } else if (this.isHarvester()) {
      tile = this.getBestHarvesterTile();
    } else if (this.isPlanter()) {
      tile = this.getBestPlanterTile();
    }

    if (tile !== null) {
      if (this.distance(tile) < 200) {
        if (this.canInteract(tile.land)) {
          switch(tile.land) {
            case LandState.EMPTY:
              tile.plow();
              this.wait = 125 * this.stats.plowSpeed;
              break;
            case LandState.PLOWED:
              tile.plant(this.bestCrop);
              this.wait = 50 * this.stats.plantSpeed;
              break;
            case LandState.READY:
              tile.harvest();
              this.wait = 100 * this.stats.harvestSpeed;
              break;
          }
        }
      } else {
        this.scene.physics.moveTo(this, tile.sprite.x, tile.sprite.y, 60 * this.stats.movementSpeed);
      }
    }
  }

  getBestHarvesterTile(): Land {
    if (this.farm.ready.size > 0) {
      return this.getBestTile(LandState.READY);
    } else {
      return this.getBestTile(LandState.PLANTED);
    }
  }

  getBestPlanterTile(): Land {
    if (this.farm.plowed.size > 0 && this.canAffordCrop()) {
      return this.getBestTile(LandState.PLOWED);
    } else {
      return this.getBestTile(LandState.EMPTY);
    }
  }

  getBestAllTile(): Land {
    if (this.farm.ready.size > 0) {
      return this.getBestTile(LandState.READY);
    } else if (this.farm.plowed.size > 0 && this.canAffordCrop()) {
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

  getBestCrop(): Crop {
    const money = this.registry.get('money');
    let best = 0;
    for (var i = 0; i < Crops.length; i++) {
      if (Crops[i].revenue > Crops[best].revenue && money - 3 * (Crops[i].cost + 5) >= this.baseMoney) best = i;
    }

    return Crops[best];
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
        arr = this.farm.plowed.entries;
        break;
      case LandState.PLANTED:
        arr = this.farm.planted.entries;
        break;
      case LandState.READY:
        arr = this.farm.ready.entries;
        break;
      case LandState.EMPTY:
        arr = this.farm.empty.entries;
        break;
    }

    var score = 9999999999;
    var best = null;

    if (arr) {
      arr.forEach((tile: Land) => {
        const tmpScore = this.getScore(tile);
        if (tmpScore < score) {
          score = tmpScore;
          best = tile;
        }
      });
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