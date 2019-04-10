import { Crops } from './crops';
import { Farm } from './farm';
import { Land, LandState } from './land';

export class Farmer extends Phaser.GameObjects.Image {
  farm: Farm;
  registry: Phaser.Data.DataManager;

  constructor(scene: Phaser.Scene, x: number, y: number, farm: Farm) {
    super(scene, x, y, 'crops', 20);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.farm = farm;
    this.registry = scene.game.registry;
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    var tile = null;

    if (this.farm.ready.getLength() > 0) {
      tile = this.getClosestTile(LandState.READY);
    } else if (this.farm.plowed.getLength() > 0 && this.registry.get('money') > Crops[this.registry.get('currentCrop')].cost) {
      tile = this.getClosestTile(LandState.PLOWED);
      if (Phaser.Math.Distance.Squared(this.x, this.y, tile.sprite.x, tile.sprite.y) > 5000) {
        tile = this.getClosestTile(LandState.EMPTY);
      }
    } else if (this.registry.get('money') > 5) {
      tile = this.getClosestTile(LandState.EMPTY);
    }

    if (tile !== null) {
      if (Phaser.Math.Distance.Squared(this.x, this.y, tile.sprite.x, tile.sprite.y) < 200) {
        tile.handleClick();
      } else {
        this.scene.physics.moveTo(this, tile.sprite.x, tile.sprite.y);
      }
    }
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
      default:
        arr = this.farm.empty.getChildren();
        break;
    }

    var dist = 9999999999;
    var closest = null;
    for (var i = 0; i < arr.length; i++) {
      const tile = arr[i] as Land;
      const tmpDist = Phaser.Math.Distance.Squared(this.x, this.y, tile.sprite.x, tile.sprite.y);
      if (tmpDist < dist) {
        dist = tmpDist;
        closest = tile;
      }
    }

    return closest;
  }
}