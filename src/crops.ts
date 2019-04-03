export interface Crop {
  name: string;
  cost: number;
  revenue: number;
  time_to_ripe: number; // seconds to ripen
  time_to_death: number; // seconds after it's ripe
  frame: number;
}

export let Crops: Crop[] = [
  {
    name: 'tomato',
    cost: 10,
    revenue: 18,
    time_to_ripe: 10,
    time_to_death: 30,
    frame: 0
  },
  {
    name: 'potato',
    cost: 15,
    revenue: 24,
    time_to_ripe: 20,
    time_to_death: 35,
    frame: 1
  },
  {
    name: 'artichoke',
    cost: 20,
    revenue: 38,
    time_to_ripe: 60,
    time_to_death: 60,
    frame: 3
  },
  {
    name: 'carrot',
    cost: 15,
    revenue: 26,
    time_to_ripe: 30,
    time_to_death: 60,
    frame: 2
  },
  {
    name: 'eggplant',
    cost: 30,
    revenue: 78,
    time_to_ripe: 120,
    time_to_death: 120,
    frame: 5
  },
  {
    name: 'peppers',
    cost: 40,
    revenue: 82,
    time_to_ripe: 180,
    time_to_death: 180,
    frame: 4
  }
];