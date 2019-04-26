import { Names } from "./names";
import { Farmer } from "./farmer";

export enum FarmerType {
  ALL,
  PLANTER,
  HARVESTER
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
    type: FarmerType.PLANTER,
    cost: 8500,
    text: 'A farmer who specializes in only planting crops'
  },
  {
    type: FarmerType.HARVESTER,
    cost: 8500,
    text: 'A farmer who specializes in only harvesting crops'
  }
]

export class FarmerStats {
  name: string;
  harvestSpeed: number;
  movementSpeed: number;
  plantSpeed: number;
  plowSpeed: number;

  constructor(farmer: Farmer) {
    this.name = Names[Math.floor(Math.random() * Names.length)];

    var rndNums;
    switch (farmer.farmerType) {
      case FarmerType.HARVESTER:
        rndNums = 1;
        break;
      case FarmerType.PLANTER:
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
      case FarmerType.HARVESTER:
        this.harvestSpeed = 1 + rnd[0];
        break;
      case FarmerType.PLANTER:
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