export interface Crop {
  name: string;
  cost: number;
  revenue: number;
  timeToRipe: number; // seconds to ripen
  timeToDeath: number; // seconds after it's ripe
  frame: number;
}

export let Crops: Crop[] = [
  {
    name: 'tomato',
    cost: 10,
    revenue: 18,
    timeToRipe: 10,
    timeToDeath: 30,
    frame: 0
  },
  {
    name: 'potato',
    cost: 15,
    revenue: 24,
    timeToRipe: 20,
    timeToDeath: 35,
    frame: 1
  },
  {
    name: 'artichoke',
    cost: 20,
    revenue: 38,
    timeToRipe: 60,
    timeToDeath: 60,
    frame: 3
  },
  {
    name: 'carrot',
    cost: 15,
    revenue: 26,
    timeToRipe: 30,
    timeToDeath: 60,
    frame: 2
  },
  {
    name: 'eggplant',
    cost: 30,
    revenue: 78,
    timeToRipe: 120,
    timeToDeath: 120,
    frame: 5
  },
  {
    name: 'peppers',
    cost: 40,
    revenue: 82,
    timeToRipe: 180,
    timeToDeath: 180,
    frame: 4
  }
];