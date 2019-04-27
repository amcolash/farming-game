import { Crop, Crops } from './crops';
import { Farm } from './farm';
import { Land, LandState } from './land';
import { FarmerType, FarmerStats, FarmerBaseStats } from './farmerData';

export class Farmer extends Phaser.GameObjects.Container {
  static ringTexture: Phaser.Textures.CanvasTexture;
  readonly baseMoney: number = 200;

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

    // On init of class, generate the ring texture
    if (!Farmer.ringTexture) {
      this.generateTexture();
    }
    scene.add.image(x, y, 'gradient').setScale(2, 2).setAlpha(0.6).setBlendMode(Phaser.BlendModes.OVERLAY);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.farmerType = type;
    this.farm = farm;
    this.spawnLocation = new Phaser.Math.Vector2(x, y);
    this.stats = new FarmerStats(this);
    this.registry = scene.game.registry;
    this.world = scene.physics.world;

    // this.add(new Phaser.GameObjects.Arc(scene, 0, 12, 4, 0, 360, false, type == FarmerType.ALL ? 0xff0000 : (type == FarmerType.HARVESTER ? 0x00ff00 : 0x0000ff)));

    const sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, Farmer.getSprite(type), 0);
    this.add(sprite);

    scene.game.events.on('hoverFarmer', (farmer) => {
      if (farmer === this) {
        sprite.setTint(0xaaaaff);
      } else {
        sprite.setTint(0xffffff);
      }
    });

    // When the game is paused, stop the famers too
    scene.game.events.on('speed', value => {
      if (value === 0) (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    });

    if (this.isPlanter()) {
      this.cropImage = new Phaser.GameObjects.Sprite(scene, 0, -32, 'crops', this.getBestCrop().frame);
      this.add(this.cropImage);
    }
  }

  static getSprite(type: FarmerType): string {
    switch (type) {
      case FarmerType.ALL: return 'farmer_a';
      case FarmerType.HARVESTER: return 'farmer_b';
      case FarmerType.PLANTER: return 'farmer_c';
    }
  }

  update(time: number, delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    
    if (this.wait > 0) {
      this.wait -= delta * (1 / this.world.timeScale);
      return;
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
              this.wait = FarmerBaseStats.PlowSpeed * this.stats.plowSpeed;
              break;
            case LandState.PLOWED:
              const best = this.getBestCrop();
              tile.plant(best);
              this.cropImage.setFrame(best.frame);
              this.wait = FarmerBaseStats.PlantSpeed * this.stats.plantSpeed;
              break;
            case LandState.READY:
              tile.harvest();
              this.wait = FarmerBaseStats.HarvestSpeed * this.stats.harvestSpeed;
              break;
          }
        }
      } else {
        this.scene.physics.moveTo(this, tile.sprite.x, tile.sprite.y, FarmerBaseStats.MovementSpeed * this.stats.movementSpeed);
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
    return this.farmerType == FarmerType.ALL || this.farmerType == FarmerType.PLANTER;
  }

  isHarvester(): boolean {
    return this.farmerType == FarmerType.ALL || this.farmerType == FarmerType.HARVESTER;
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
      if (Crops[i].revenue > Crops[best].revenue && money - (3 * (Crops[i].cost + 5)) >= this.baseMoney) best = i;
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

    var score = Number.MAX_SAFE_INTEGER;
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

  generateTexture(): void {
    Farmer.ringTexture = this.scene.textures.createCanvas('gradient', 256, 256);
    const context = Farmer.ringTexture.getContext();
    context.filter = 'blur(2px)';
    context.beginPath();
    context.arc(128, 128, 90, 0, 2 * Math.PI, false);
    context.lineWidth = 3;
    context.strokeStyle = '#009900';
    context.stroke();

    //  Call this if running under WebGL, or you'll see nothing change
    Farmer.ringTexture.refresh();
  }
}