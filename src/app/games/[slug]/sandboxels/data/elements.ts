import {
  behaveCloner,
  behaveCrawler,
  behaveDgas,
  behaveFly,
  behaveBouncy,
  behaveGas,
  behaveLiquid,
  behaveMolten,
  behavePowder,
  behaveSturdyPowder,
  behaveSuperfluid,
  behaveULUR,
  behaveSeedrise,
  behaveWall,
} from '../engine/simulation';

export interface ElementDefinition {
  [key: string]: unknown;
  color?: string | string[];
  colorObject?: { r: number; g: number; b: number } | { r: number; g: number; b: number }[];
  behavior?: ((pixel: import("../engine/core").Pixel) => void) | string[] | string[][];
  tick?: (pixel: import("../engine/core").Pixel) => void;
  tool?: (pixel: import("../engine/core").Pixel) => void;
  category?: string;
  state?: string;
  density?: number;
  temp?: number;
  tempHigh?: number;
  tempLow?: number;
  stateHigh?: string | string[] | (string | null)[] | null;
  stateLow?: string | string[] | (string | null)[] | null;
  stateHighName?: string;
  stateLowName?: string;
  hidden?: boolean;
  conduct?: number;
  viscosity?: number;
  burn?: number;
  burnTime?: number;
  burnInto?: string | (string | null)[];
  breakInto?: string | (string | null)[];
  burning?: boolean;
  charge?: number;
  fireColor?: string | string[];
  fireElement?: string | string[] | null;
  reactions?: Record<string, ReactionDef>;
  hardness?: number;
  insulate?: boolean;
  movable?: boolean;
  ignore?: string | string[];
  stain?: number;
  stainSelf?: boolean;
  colorOn?: string | string[];
  behaviorOn?: string[] | string[][];
  heatCapacity?: number;
  extinguish?: boolean;
  darkText?: boolean;
  customColor?: boolean;
  canPlace?: boolean;
  maxSize?: number;
  cooldown?: number;
  rotatable?: boolean;
  flippableX?: boolean;
  flippableY?: boolean;
  noMix?: boolean;
  excludeRandom?: boolean;
  buttonColor?: string | string[];
  forceSaveColor?: boolean;
  ignoreAir?: boolean;
  glow?: boolean;
  alpha?: number;
  properties?: Record<string, unknown>;
  isGas?: boolean;
  singleColor?: boolean;
  forceAutoGen?: boolean;
  pickElement?: string;
  desc?: string;
  name?: string;
  alias?: string | string[];
  foodNeed?: number;
  egg?: string;
  eggColor?: string | string[];
  baby?: string;
  stateHighColor?: string | string[];
  stateLowColor?: string | string[];
  stateHighColorMultiplier?: number | number[];
  stateLowColorMultiplier?: number | number[];
  onPlace?: (pixel: import("../engine/core").Pixel) => void;
  onDelete?: (pixel: import("../engine/core").Pixel) => void;
  onChange?: (pixel: import("../engine/core").Pixel, oldElement: string) => void;
  onMix?: (p1: import("../engine/core").Pixel, p2: import("../engine/core").Pixel) => void;
  onCollide?: (p1: import("../engine/core").Pixel, p2: import("../engine/core").Pixel) => void;
  onMoveInto?: (self: import("../engine/core").Pixel, other: import("../engine/core").Pixel) => void;
  onMouseUp?: () => void;
  onMouseDown?: () => void;
  onUnselect?: () => void;
  onSelect?: () => void;
  onShiftSelect?: (element: string) => void;
  perTick?: () => void;
  renderer?: (pixel: import("../engine/core").Pixel, ctx: CanvasRenderingContext2D) => void;
  // Runtime (set by init)
  id?: number;
  grain?: number;
  superconductorAt?: number;
  onlyConduct?: string[];
  ignoreConduct?: string[];
  extraTempHigh?: Record<number, string>;
  extraTempLow?: Record<number, string>;
}

export interface ReactionDef {
  elem1?: string | string[] | (string | null)[] | null;
  elem2?: string | string[] | (string | null)[] | null;
  tempMin?: number;
  tempMax?: number;
  chance?: number;
  oneway?: boolean;
  charged?: boolean;
  setting?: string;
  burning1?: boolean;
  burning2?: boolean;
  color2?: string | string[];
  color1?: string | string[];
  temp1?: number;
  temp2?: number;
  charge1?: number;
  charge2?: boolean | number;
  stain1?: string;
  stain2?: string;
  attr2?: Record<string, unknown>;
  attr1?: Record<string, unknown>;
  func?: ((pixel: import("../engine/core").Pixel, target?: import("../engine/core").Pixel) => void) | null;
  y?: [number, number];
}

const elements: Record<string, ElementDefinition> = {
  // -------------------- LAND --------------------

  "sand": {
    color: "#e6d577",
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 1602,
    tempHigh: 1700,
    stateHigh: "molten_glass",
    reactions: {
      water: { elem1: "wet_sand", elem2: null },
      salt_water: { elem1: "wet_sand", elem2: "foam" },
      sugar_water: { elem1: "wet_sand" },
      seltzer: { elem1: "wet_sand" },
      dirty_water: { elem1: "wet_sand" },
      pool_water: { elem1: "wet_sand" },
      slush: { elem1: "wet_sand" },
      soda: { elem1: "wet_sand" },
      juice: { elem1: "wet_sand" },
      milk: { elem1: "wet_sand" },
      chocolate_milk: { elem1: "wet_sand" },
      fruit_milk: { elem1: "wet_sand" },
      pilk: { elem1: "wet_sand" },
      eggnog: { elem1: "wet_sand" },
      nut_milk: { elem1: "wet_sand" },
      cream: { elem1: "wet_sand" },
      vinegar: { elem1: "wet_sand" },
      blood: { elem1: "wet_sand" },
      vaccine: { elem1: "wet_sand" },
      antibody: { elem1: "wet_sand" },
      infection: { elem1: "wet_sand" },
      poison: { elem1: "wet_sand" },
      antidote: { elem1: "wet_sand" },
      tornado: { elem1: "sandstorm", oneway: true }
    }
  },
  // -------------------- TOOLS --------------------

  "heat": {
    color: "#ff0000",
    behavior: [
          "HT:2|HT:2|HT:2",
          "HT:2|HT:2|HT:2",
          "HT:2|HT:2|HT:2"
        ],
    category: "tools",
    temp: 2,
    insulate: true,
    canPlace: false,
    desc: "Use on pixels to increase temperature."
  },
  "cool": {
    color: "#0000ff",
    behavior: [
          "CO:2|CO:2|CO:2",
          "CO:2|CO:2|CO:2",
          "CO:2|CO:2|CO:2"
        ],
    category: "tools",
    temp: -2,
    insulate: true,
    canPlace: false,
    desc: "Use on pixels to decrease temperature."
  },
  "erase": {
    color: "#fdb5ff",
    behavior: [
          "DL|DL|DL",
          "DL|DL|DL",
          "DL|DL|DL"
        ],
    category: "tools",
    canPlace: false,
    desc: "Use on pixels to delete them."
  },
  "drag": {
    color: "#c1cfb6",
    behavior: [
          "XX|XX|XX",
          "XX|XX|SW",
          "XX|XX|XX"
        ],
    category: "tools",
    darkText: true,
    canPlace: false,
    rotatable: true,
    desc: "Use on pixels to move them around."
  },
  "pick": {
    color: [
          "#fa9b9b",
          "#fae99b",
          "#9bfab7",
          "#9b9dfa"
        ],
    behavior: [
          "CF|CF|CF",
          "CF|DL%5|CF",
          "CF|CF|CF"
        ],
    category: "tools",
    darkText: true,
    canPlace: false,
    maxSize: 1,
    desc: "Use on a pixel to select its element."
  },
  "mix": {
    color: [
          "#fff4b5",
          "#a6a6a6"
        ],
    behavior: [
          "SW|SW|SW",
          "SW|DL%5|SW",
          "SW|SW|SW"
        ],
    category: "tools",
    darkText: true,
    canPlace: false,
    desc: "Use on pixels to randomize their position."
  },
  "lookup": {
    color: [
          "#5e807d",
          "#5e807d",
          "#679e99",
          "#5e807d",
          "#5e807d"
        ],
    behavior: behaveWall,
    category: "tools",
    canPlace: false,
    maxSize: 5,
    desc: "Use on a pixel to display its element info."
  },
  "shock": {
    color: "#ffff00",
    behavior: [
          "SH|SH|SH",
          "SH|DL%5|SH",
          "SH|SH|SH"
        ],
    category: "tools",
    darkText: true,
    canPlace: false,
    desc: "Use on pixels to increase electric charge."
  },
  "paint": {
    color: [
          "#c27070",
          "#c29c70",
          "#c2c270",
          "#70c270",
          "#70c2c2",
          "#7070c2",
          "#c270c2"
        ],
    category: "tools",
    customColor: true,
    canPlace: false,
    desc: "Use on pixels to change color."
  },
  // -------------------- LIQUIDS --------------------

  "water": {
    color: "#2167ff",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 997,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "steam",
    stateLow: "ice",
    conduct: 0.02,
    stain: -0.5,
    heatCapacity: 4.184,
    extinguish: true,
    reactions: {
      salt: { elem1: "salt_water", temp1: -20 },
      sugar: { elem1: "sugar_water" },
      honey: { elem1: "sugar_water" },
      caramel: { elem1: "sugar_water" },
      molasses: { elem1: "sugar_water", chance: 0.05 },
      candy: { elem1: "sugar_water", elem2: "foam", chance: 0.005 },
      dust: { elem1: "dirty_water" },
      ash: { elem1: "dirty_water" },
      cyanide: { elem1: "dirty_water" },
      cyanide_gas: { elem1: "dirty_water" },
      carbon_dioxide: { elem1: "seltzer", oneway: true },
      sulfur: { elem1: "dirty_water" },
      rat: { elem1: "dirty_water", chance: 0.005 },
      infection: { elem1: "dirty_water" },
      plague: { elem1: "dirty_water" },
      rust: { elem1: "dirty_water", chance: 0.005 },
      lead: { elem1: "dirty_water", chance: 0.005 },
      solder: { elem1: "dirty_water", chance: 0.005 },
      fallout: { elem1: "dirty_water", chance: 0.25 },
      radiation: { elem1: "dirty_water", chance: 0.25 },
      uranium: { elem1: "dirty_water", chance: 0.25 },
      rad_steam: { elem1: "dirty_water", chance: 0.02 },
      rad_glass: { elem1: "dirty_water", chance: 0.005 },
      rad_shard: { elem1: "dirty_water", chance: 0.01 },
      rotten_meat: { elem1: "dirty_water", chance: 0.25 },
      rotten_cheese: { elem1: "dirty_water", chance: 0.25 },
      cancer: { elem1: "dirty_water", chance: 0.25 },
      oil: { elem1: "dirty_water", chance: 0.005 },
      dioxin: { elem1: "dirty_water", chance: 0.1 },
      neutron: { elem1: [
                "dirty_water",
                "dirty_water",
                "dirty_water",
                "rad_steam"
              ], chance: 0.1 },
      rock: { elem2: "wet_sand", chance: 0.00035 },
      limestone: { elem2: "wet_sand", chance: 0.00035 },
      tuff: { elem2: "wet_sand", color2: "#7a6b5c", chance: 0.00035 },
      ruins: { elem2: "rock", chance: 0.00035 },
      mudstone: { elem2: "mud", chance: 0.00035 },
      methane: { elem1: "primordial_soup", elem2: "primordial_soup", tempMin: 60, charged: true },
      ammonia: { elem1: "primordial_soup", elem2: "primordial_soup", tempMin: 60, charged: true },
      fly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.05, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.1, oneway: true },
      cured_meat: { elem1: "salt_water", elem2: "meat" },
      water: { elem2: "bubble", attr2: {
                clone: "water"
              }, chance: 0.001, tempMin: 85 },
      aluminum: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0025 },
      zinc: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.015 },
      steel: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0125 },
      iron: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0125 },
      tin: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.01 },
      brass: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.001 },
      bronze: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.001 },
      copper: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0075 },
      silver: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0075 },
      gold: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0075 }
    }
  },
  "salt_water": {
    color: "#4d85ff",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1026,
    tempHigh: 102,
    tempLow: -2,
    stateHigh: [
          "steam",
          "salt"
        ],
    stateLowName: "salt_ice",
    conduct: 0.1,
    stain: -0.66,
    extinguish: true,
    reactions: {
      dust: { elem1: "dirty_water" },
      ash: { elem1: "dirty_water" },
      carbon_dioxide: { elem1: "seltzer" },
      sulfur: { elem1: "dirty_water" },
      cyanide: { elem1: "dirty_water" },
      rat: { elem1: "dirty_water", chance: 0.005 },
      infection: { elem1: "dirty_water" },
      plague: { elem1: "dirty_water" },
      fallout: { elem1: "dirty_water", chance: 0.25 },
      radiation: { elem1: "dirty_water", chance: 0.25 },
      rust: { elem1: "dirty_water", chance: 0.005 },
      lead: { elem1: "dirty_water", chance: 0.005 },
      solder: { elem1: "dirty_water", chance: 0.005 },
      rock: { elem2: "wet_sand", chance: 0.0005 },
      limestone: { elem2: "wet_sand", chance: 0.0005 },
      fly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.05, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.1, oneway: true },
      cancer: { elem1: "dirty_water", chance: 0.25 },
      oil: { elem1: "dirty_water", chance: 0.005 },
      uranium: { elem1: "dirty_water", chance: 0.25 },
      wet_sand: { oneway: true, chance: 0.007 },
      salt_water: { elem2: "bubble", attr2: {
                clone: "salt_water"
              }, chance: 0.001, tempMin: 85 },
      aluminum: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.0025 },
      zinc: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.015 },
      steel: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.0125 },
      iron: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.0125 },
      tin: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.01 },
      brass: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.001 },
      bronze: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.001 },
      copper: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.0075 },
      silver: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.0075 },
      gold: { elem1: [
                "hydrogen",
                "lye",
                "chlorine"
              ], charged: true, chance: 0.0075 }
    }
  },
  "sugar_water": {
    color: "#8eaae6",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1026,
    tempHigh: 105,
    tempLow: -5,
    stateHigh: [
          "steam",
          "sugar"
        ],
    stateLowName: "sugar_ice",
    hidden: true,
    conduct: 0.05,
    stain: -0.45,
    extinguish: true,
    reactions: {
      dust: { elem1: "dirty_water" },
      ash: { elem1: "dirty_water" },
      carbon_dioxide: { elem1: "soda" },
      cyanide: { elem1: "dirty_water" },
      sulfur: { elem1: "dirty_water" },
      charcoal: { elem1: "dirty_water", chance: 0.005 },
      rat: { elem1: "dirty_water", chance: 0.005 },
      infection: { elem1: "dirty_water" },
      plague: { elem1: "dirty_water" },
      fallout: { elem1: "dirty_water", chance: 0.25 },
      radiation: { elem1: "dirty_water", chance: 0.25 },
      rust: { elem1: "dirty_water", chance: 0.005 },
      lead: { elem1: "dirty_water", chance: 0.005 },
      solder: { elem1: "dirty_water", chance: 0.005 },
      rock: { elem2: "wet_sand", chance: 0.0004 },
      limestone: { elem2: "wet_sand", chance: 0.0004 },
      fly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.05, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.1, oneway: true },
      uranium: { elem1: "dirty_water", chance: 0.25 },
      sugar_water: { elem2: "bubble", attr2: {
                clone: "sugar_water"
              }, chance: 0.001, tempMin: 85 },
      aluminum: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.0025 },
      zinc: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.015 },
      steel: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.0125 },
      iron: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.0125 },
      tin: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.01 },
      brass: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.001 },
      bronze: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.001 },
      copper: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.0075 },
      silver: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.0075 },
      gold: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "sugar"
              ], charged: true, chance: 0.0075 }
    }
  },
  "seltzer": {
    color: [
          "#8eaae6",
          "#82a4ed",
          "#b5c5e8",
          "#8eaae6",
          "#82a4ed"
        ],
    behavior: [
          "XX|CR:foam%3|XX",
          "M2|XX|M2",
          "M2|M1|M2"
        ],
    category: "liquids",
    state: "liquid",
    density: 1026.91,
    tempHigh: 98,
    tempLow: 0,
    stateHigh: [
          "steam",
          "carbon_dioxide"
        ],
    stateLowName: "seltzer_ice",
    hidden: true,
    conduct: 0.05,
    stain: -0.45,
    extinguish: true,
    alias: [
          "carbonated water",
          "soda water"
        ],
    reactions: {
      rock: { elem2: "wet_sand", chance: 0.0004 },
      limestone: { chance: 0.0004 },
      sugar: { elem1: "soda", elem2: "foam" },
      sugar_water: { elem1: "soda", elem2: "foam" },
      cyanide: { elem1: "dirty_water" },
      infection: { elem1: "dirty_water" },
      dust: { elem1: "dirty_water" },
      ash: { elem1: "dirty_water" },
      fly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.05, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.1, oneway: true },
      plant: { elem1: "water" },
      evergreen: { elem1: "water" },
      cactus: { elem1: "water" },
      algae: { elem1: "water" },
      kelp: { elem1: "water" },
      coral: { elem1: "water" },
      uranium: { elem1: "dirty_water", chance: 0.25 },
      seltzer: { elem2: "bubble", attr2: {
                clone: "seltzer"
              }, chance: 0.001, tempMin: 85 },
      aluminum: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.0025 },
      zinc: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.015 },
      steel: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.0125 },
      iron: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.0125 },
      tin: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.01 },
      lead: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.01 },
      brass: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.001 },
      bronze: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.001 },
      copper: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.0075 },
      silver: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.0075 },
      gold: { elem1: [
                "hydrogen",
                "hydrogen",
                "oxygen",
                "carbon_dioxide"
              ], charged: true, chance: 0.0075 }
    }
  },
  "dirty_water": {
    color: [
          "#0e824e",
          "#07755a",
          "#0c6934"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1005,
    tempHigh: 105,
    tempLow: -5,
    stateHigh: [
          "steam",
          "carbon_dioxide"
        ],
    stateLowName: "dirty_ice",
    hidden: true,
    conduct: 0.1,
    viscosity: 10,
    extinguish: true,
    reactions: {
      rock: { elem2: "wet_sand", chance: 0.0004 },
      limestone: { elem2: "wet_sand", chance: 0.0004 },
      plant: { elem1: "water", chance: 0.05 },
      algae: { elem1: "water", chance: 0.05 },
      kelp: { elem1: "water", chance: 0.05 },
      coral: { elem2: "dirty_water", chance: 0.004 },
      charcoal: { elem1: "water", chance: 0.02 },
      gravel: { elem1: "water", chance: 0.01 },
      fly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.05, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.1, oneway: true },
      dirty_water: { elem2: "bubble", attr2: {
                clone: "water"
              }, chance: 0.001, tempMin: 85 }
    }
  },
  "pool_water": {
    color: "#a8d2e3",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 992.72,
    tempHigh: 105,
    tempLow: -5,
    stateHigh: [
          "steam",
          "chlorine"
        ],
    stateLowName: "pool_ice",
    hidden: true,
    conduct: 0.15,
    stain: -0.5,
    extinguish: true,
    reactions: {
      rock: { elem2: "wet_sand", chance: 0.001 },
      limestone: { elem2: "wet_sand", chance: 0.001 },
      plant: { elem2: "dead_plant", chance: 0.05 },
      evergreen: { elem2: "dead_plant", chance: 0.05 },
      cactus: { elem2: "dead_plant", chance: 0.05 },
      grass: { elem2: "dead_plant", chance: 0.05 },
      algae: { chance: 0.05 },
      kelp: { elem2: "pool_water", chance: 0.05 },
      coral: { elem2: "pool_water", chance: 0.01 },
      cell: { chance: 0.05 },
      cancer: { chance: 0.05 },
      plague: {  },
      flea: { elem2: "dead_bug", chance: 0.05 },
      termite: { elem2: "dead_bug", chance: 0.05 },
      ant: { elem2: "dead_bug", chance: 0.05 },
      worm: { elem2: "dead_bug", chance: 0.05 },
      fly: { elem2: "dead_bug", chance: 0.05 },
      firefly: { elem2: "dead_bug", chance: 0.05 },
      bee: { elem2: "dead_bug", chance: 0.05 },
      stink_bug: { elem2: "dead_bug", chance: 0.05 },
      dirty_water: { elem2: "water", chance: 0.05 },
      slug: { chance: 0.05 },
      snail: { chance: 0.05 },
      lichen: { chance: 0.05 },
      dead_bug: { chance: 0.001 },
      pollen: {  },
      root: { elem2: "fiber", chance: 0.05 },
      flower_seed: { elem2: "dead_plant", chance: 0.05 },
      wheat_seed: { elem2: "dead_plant", chance: 0.05 },
      bamboo_plant: { elem2: "dead_plant", chance: 0.05 },
      potato_seed: { elem2: "dead_plant", chance: 0.05 },
      corn_seed: { elem2: "dead_plant", chance: 0.05 },
      sapling: { elem2: "dead_plant", chance: 0.05 },
      pinecone: { elem2: "dead_plant", chance: 0.05 },
      blood: { chance: 0.01 },
      infection: { chance: 0.05 },
      antibody: { chance: 0.01 },
      poison: { chance: 0.01 },
      charcoal: { elem1: "water", chance: 0.02 },
      dna: { chance: 0.002 },
      pool_water: { elem2: "bubble", attr2: {
                clone: "pool_water"
              }, chance: 0.001, tempMin: 85 }
    }
  },
  // -------------------- LAND --------------------

  "dirt": {
    color: [
          "#76552b",
          "#5c4221",
          "#573c1a",
          "#6b481e"
        ],
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 1220,
    tempHigh: 1200,
    stateHigh: "molten_dirt",
    tempLow: -50,
    stateLow: "permafrost",
    reactions: {
      water: { elem1: "mud" },
      salt_water: { elem1: "mud" },
      sugar_water: { elem1: "mud" },
      seltzer: { elem1: "mud" },
      dirty_water: { elem1: "mud" },
      pool_water: { elem1: "mud" },
      slush: { elem1: "mud" },
      soda: { elem1: "mud" },
      juice: { elem1: "mud" },
      milk: { elem1: "mud" },
      chocolate_milk: { elem1: "mud" },
      fruit_milk: { elem1: "mud" },
      pilk: { elem1: "mud" },
      eggnog: { elem1: "mud" },
      nut_milk: { elem1: "mud" },
      cream: { elem1: "mud" },
      vinegar: { elem1: "mud" },
      blood: { elem1: "mud" },
      vaccine: { elem1: "mud" },
      antibody: { elem1: "mud" },
      infection: { elem1: "mud" },
      poison: { elem1: "mud" },
      antidote: { elem1: "mud" },
      bone: { elem1: "rock", chance: 0.001, oneway: true }
    }
  },
  "mud": {
    color: "#382417",
    behavior: behaveSturdyPowder,
    category: "land",
    state: "solid",
    density: 1730,
    tempHigh: 100,
    tempLow: -50,
    stateHigh: "mudstone",
    stateLow: "permafrost",
    stain: 0.02,
    reactions: {
      dirt: { elem1: "dirt", elem2: "mud", chance: 0.0005, oneway: true },
      sand: { elem1: "dirt", elem2: "wet_sand", chance: 0.0005, oneway: true },
      sawdust: { elem1: "mulch" },
      evergreen: { elem1: "mulch" },
      wheat: { elem1: "adobe", elem2: "adobe" },
      straw: { elem1: "adobe", elem2: "adobe" },
      flour: { elem1: "adobe", elem2: "adobe" }
    }
  },
  "wet_sand": {
    color: [
          "#a19348",
          "#b5a85e"
        ],
    behavior: behaveSturdyPowder,
    category: "land",
    state: "solid",
    density: 1905,
    tempHigh: 100,
    tempLow: -50,
    stateHigh: "packed_sand",
    stateLow: "packed_sand",
    reactions: {
      sand: { elem1: "sand", elem2: "wet_sand", chance: 0.0005, oneway: true },
      dirt: { elem1: "sand", elem2: "mud", chance: 0.0005, oneway: true },
      gravel: { elem1: "cement", chance: 0.2 }
    }
  },
  "rock": {
    color: [
          "#808080",
          "#4f4f4f",
          "#949494"
        ],
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 2550,
    tempHigh: 950,
    stateHigh: "magma",
    breakInto: [
          "sand",
          "gravel"
        ],
    hardness: 0.5,
    reactions: {
      fly: { elem2: "dead_bug", chance: 0.25, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.2, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.15, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bird: { elem2: "feather", chance: 0.025, oneway: true },
      egg: { elem2: "yolk", oneway: true },
      grass: { chance: 0.005, oneway: true },
      bone: { elem2: "oil", tempMin: 300, chance: 0.005, oneway: true },
      dead_plant: { elem2: "charcoal", tempMin: 200, chance: 0.005, oneway: true },
      charcoal: { elem2: "diamond", tempMin: 800, tempMax: 900, chance: 0.005, oneway: true },
      sand: { elem2: "packed_sand", tempMin: 500, chance: 0.005, oneway: true },
      wet_sand: { elem2: "packed_sand", chance: 0.005, oneway: true }
    }
  },
  "rock_wall": {
    color: [
          "#666666",
          "#363636",
          "#7a7a7a"
        ],
    behavior: behaveWall,
    category: "land",
    state: "solid",
    density: 2550,
    tempHigh: 950,
    stateHigh: "magma",
    breakInto: "rock",
    hardness: 0.5,
    canPlace: true
  },
  "mudstone": {
    color: "#4a341e",
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "land",
    state: "solid",
    density: 1250,
    tempHigh: 1200,
    tempLow: -50,
    stateHigh: "molten_dirt",
    stateLow: "permafrost",
    breakInto: "dirt"
  },
  "packed_sand": {
    color: [
          "#a1975d",
          "#b5ab70"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "land",
    state: "solid",
    density: 1682,
    tempHigh: 1700,
    stateHigh: "molten_glass",
    breakInto: "sand"
  },
  // -------------------- LIFE --------------------

  "plant": {
    color: "#00bf00",
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 1050,
    tempHigh: 100,
    tempLow: -1.66,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 15,
    burnTime: 60,
    burnInto: "dead_plant",
    breakInto: "dead_plant",
    forceSaveColor: true,
    reactions: {
      vinegar: { elem1: "dead_plant", chance: 0.035 },
      baking_soda: { elem1: "dead_plant", chance: 0.01 },
      bleach: { elem1: "dead_plant", chance: 0.05 },
      alcohol: { elem1: "dead_plant", chance: 0.035 },
      mercury: { elem1: "dead_plant", chance: 0.01 },
      salt: { elem1: "dead_plant", chance: 0.001 },
      stench: { chance: 0.25 },
      chlorine: { stain1: "#a2bf00" }
    }
  },
  "dead_plant": {
    color: [
          "#826521",
          "#826021",
          "#825321",
          "#70360c"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2|M1|M2"
        ],
    category: "life",
    state: "solid",
    density: 1050,
    tempHigh: 300,
    tempLow: -2,
    stateHigh: "fire",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 85,
    burnTime: 45
  },
  "frozen_plant": {
    color: "#00bf8c",
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 1000,
    temp: -2.66,
    tempHigh: 7,
    stateHigh: "dead_plant",
    hidden: true
  },
  "grass": {
    color: [
          "#439809",
          "#258b08",
          "#118511",
          "#127b12",
          "#136d14"
        ],
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 1400,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 3,
    burnTime: 20,
    breakInto: "dead_plant",
    properties: {
          h: 0
        },
    reactions: {
      vinegar: { elem1: "dead_plant", chance: 0.035 },
      mercury: { elem1: "dead_plant", chance: 0.01 },
      alcohol: { elem1: "dead_plant", chance: 0.035 },
      baking_soda: { elem1: "dead_plant", chance: 0.01 }
    },
    seed: "grass_seed"
  },
  "algae": {
    color: [
          "#395706",
          "#6f9315",
          "#9dca19"
        ],
    behavior: [
          "XX|XX|XX",
          "SW:water,salt_water,dirty_water,sugar_water%1|XX|SW:water,salt_water,dirty_water,sugar_water%1",
          "M2%10|M1|M2%10"
        ],
    category: "life",
    state: "liquid",
    density: 920,
    tempHigh: 70,
    tempLow: 0,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 95,
    burnTime: 20,
    reactions: {
      wood: { elem1: "lichen" },
      chlorine: { elem1: "dead_plant", chance: 0.035 },
      baking_soda: { elem1: "dead_plant", chance: 0.035 },
      bleach: { elem1: "dead_plant", chance: 0.035 },
      mercury: { elem1: "dead_plant", chance: 0.035 },
      broth: { elem2: "water", chance: 0.05 },
      tea: { elem2: "water", chance: 0.05 },
      nitrogen: { elem2: "algae", chance: 0.05 },
      water: { elem2: "foam", attr2: {
                clone: "water"
              }, color2: "#e3d8ca", chance: 0.001 },
      salt_water: { elem2: "foam", attr2: {
                clone: "salt_water"
              }, color2: "#e3d8ca", chance: 0.001 }
    },
    seed: "algae"
  },
  // -------------------- POWDERS --------------------

  "concrete": {
    color: "#ababab",
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "powders",
    state: "solid",
    density: 2400,
    tempHigh: 1500,
    stateHigh: "magma",
    breakInto: "dust",
    hardness: 0.5,
    darkText: true
  },
  // -------------------- SOLIDS --------------------

  "wall": {
    color: "#808080",
    behavior: behaveWall,
    category: "solids",
    density: 20000,
    hardness: 1,
    insulate: true,
    noMix: true,
    alias: "solid"
  },
  // -------------------- ENERGY --------------------

  "fire": {
    color: [
          "#ffb700",
          "#ff8800"
        ],
    category: "energy",
    state: "gas",
    density: 0.1,
    temp: 600,
    tempHigh: 7000,
    tempLow: 100,
    stateHigh: "plasma",
    stateLow: "smoke",
    burnTime: 25,
    burnInto: "smoke",
    burning: true,
    canPlace: true,
    noMix: true,
    buttonColor: [
          "#ff6b21",
          "#ffa600",
          "#ff4000"
        ],
    reactions: {
      water: { elem1: "smoke" },
      steam: { elem1: "smoke" },
      carbon_dioxide: { elem1: "smoke" },
      foam: { elem1: "smoke" },
      dirty_water: { elem1: "smoke" },
      salt_water: { elem1: "smoke" },
      sugar_water: { elem1: "smoke" },
      seltzer: { elem1: "smoke" },
      pool_water: { elem1: "smoke" },
      smoke: { chance: 0.1 },
      oxygen: { chance: 0.1 }
    }
  },
  // -------------------- WEAPONS --------------------

  "bomb": {
    color: "#524c41",
    behavior: [
          "XX|EX:10|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:10|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    cooldown: 30,
    excludeRandom: true
  },
  // -------------------- GASES --------------------

  "steam": {
    color: "#abd6ff",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 0.6,
    temp: 150,
    tempLow: 95,
    stateLow: "water",
    conduct: 0.002,
    stain: -0.05,
    extinguish: true,
    alias: "water vapor",
    reactions: {
      steam: { elem1: "cloud", elem2: "cloud", chance: 0.05, y: [
                0,
                15
              ], setting: "clouds" },
      rain_cloud: { elem1: "rain_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      cloud: { elem1: "cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      snow_cloud: { elem1: "rain_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      hail_cloud: { elem1: "rain_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      thunder_cloud: { elem1: "rain_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      pyrocumulus: { elem1: "cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      anesthesia: { elem1: "acid_cloud", chance: 0.05, y: [
                0,
                12
              ], setting: "clouds" },
      fire_cloud: { elem1: "cloud", elem2: "pyrocumulus", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      smoke: { elem1: "smog", chance: 0.001 },
      carbon_dioxide: { elem1: "smog", chance: 0.001 },
      plasma: { elem1: "ozone", tempMin: 500, charged: true },
      copper: { elem1: "oxygen", elem2: "oxidized_copper", chance: 0.01 },
      bronze: { elem1: "oxygen", elem2: "oxidized_copper", chance: 0.005 },
      iron: { elem1: "oxygen", elem2: "rust", chance: 0.005 },
      steel: { elem1: "oxygen", elem2: "rust", chance: 0.004 },
      tornado: { elem1: "cloud" },
      melted_wax: { elem1: "explosion" }
    },
    extraTempLow: {
          "0": "rime"
        }
  },
  // -------------------- SOLIDS --------------------

  "ice": {
    color: "#b2daeb",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 917,
    temp: -5,
    tempHigh: 5,
    stateHigh: "water",
    breakInto: "snow"
  },
  "rime": {
    color: "#e6f2f7",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 250,
    temp: -5,
    tempHigh: 20,
    stateHigh: "water",
    hidden: true,
    conduct: 1,
    breakInto: "packed_snow",
    behaviorOn: [
          "XX|XX|XX",
          "XX|CH:rain_cloud|XX",
          "XX|XX|XX"
        ]
  },
  // -------------------- LAND --------------------

  "snow": {
    color: "#e1f8fc",
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 100,
    temp: -5,
    tempHigh: 18,
    tempLow: -100,
    stateHigh: "water",
    stateLow: "packed_snow",
    reactions: {
      water: { elem1: "slush", elem2: "slush" },
      salt_water: { elem1: "slush", elem2: "slush" },
      dirty_water: { elem1: "slush", elem2: "slush" },
      pool_water: { elem1: "slush", elem2: "slush" },
      sugar_water: { elem1: "slush", elem2: "slush" },
      seltzer: { elem1: "slush", elem2: "slush" },
      uranium: { elem1: "dirty_water", chance: 0.001 }
    }
  },
  // -------------------- LIQUIDS --------------------

  "slush": {
    color: "#81bcd4",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 95,
    temp: -5,
    tempHigh: 18,
    tempLow: -20,
    stateHigh: "water",
    stateLow: "ice",
    hidden: true,
    viscosity: 100,
    reactions: {
      uranium: { elem1: "dirty_water", chance: 0.25 }
    }
  },
  // -------------------- LAND --------------------

  "packed_snow": {
    color: "#bcdde3",
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["M2", "M1", "M2"]
    ],
    category: "land",
    state: "solid",
    density: 400,
    temp: -5,
    tempHigh: 20,
    tempLow: -200,
    stateHigh: "water",
    stateLow: "ice",
    hidden: true,
    breakInto: "snow"
  },
  // -------------------- SOLIDS --------------------

  "wood": {
    color: "#a0522d",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 600,
    tempHigh: 400,
    stateHigh: [
          "ember",
          "charcoal",
          "fire",
          "fire",
          "fire"
        ],
    burn: 5,
    burnTime: 300,
    burnInto: [
          "ember",
          "charcoal",
          "fire"
        ],
    breakInto: "sawdust",
    hardness: 0.15,
    forceSaveColor: true
  },
  // -------------------- GASES --------------------

  "smoke": {
    color: "#383838",
    behavior: behaveDgas,
    category: "gases",
    state: "gas",
    density: 0.1,
    temp: 114,
    tempHigh: 1000,
    stateHigh: "fire",
    stain: 0.075,
    noMix: true,
    reactions: {
      steam: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      rain_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      snow_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      hail_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      thunder_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      acid_cloud: { elem1: "pyrocumulus", chance: 0.05, y: [
                0,
                12
              ], setting: "clouds" },
      fire_cloud: { elem1: "pyrocumulus", chance: 0.05, y: [
                0,
                12
              ], setting: "clouds" },
      rad_cloud: { elem1: "pyrocumulus", chance: 0.05, y: [
                0,
                12
              ], setting: "clouds" },
      pyrocumulus: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" }
    }
  },
  // -------------------- LIQUIDS --------------------

  "magma": {
    color: [
          "#ff6f00",
          "#ff8c00",
          "#ff4d00"
        ],
    behavior: behaveMolten,
    category: "liquids",
    state: "liquid",
    density: 2725,
    temp: 1200,
    tempLow: 800,
    stateLow: [
          "basalt",
          "basalt",
          "basalt",
          "rock"
        ],
    viscosity: 10000,
    alias: "lava",
    reactions: {
      ice: { elem1: "basalt" },
      ash: { elem1: "molten_tuff" },
      molten_ash: { elem1: "molten_tuff" },
      charcoal: { elem2: "diamond", tempMin: 800, tempMax: 900, chance: 0.005, oneway: true }
    }
  },
  // -------------------- ENERGY --------------------

  "plasma": {
    color: [
          "#8800ff",
          "#b184d9",
          "#8800ff"
        ],
    behavior: behaveDgas,
    category: "energy",
    state: "gas",
    density: 1,
    temp: 7065,
    tempLow: 5000,
    stateLow: "fire",
    conduct: 1,
    behaviorOn: [
          "M2|M1|M2",
          "CL%5 AND M1|XX|CL%5 AND M1",
          "M2|M1|M2"
        ],
    canPlace: true
  },
  "cold_fire": {
    color: "#009dff",
    behavior: behaveULUR,
    category: "energy",
    state: "gas",
    density: 0.1,
    temp: -200,
    tempHigh: 0,
    stateHigh: "smoke",
    canPlace: true,
    buttonColor: [
          "#21cbff",
          "#006aff",
          "#00ffff"
        ],
    reactions: {
      fire: { elem1: "smoke", elem2: "smoke" },
      plasma: { elem1: "light", elem2: "light" },
      smoke: { chance: 0.1 }
    }
  },
  // -------------------- SOLIDS --------------------

  "glass": {
    color: [
          "#5e807d",
          "#5e807d",
          "#679e99",
          "#5e807d",
          "#5e807d"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 2500,
    tempHigh: 1500,
    breakInto: "glass_shard",
    noMix: true,
    reactions: {
      radiation: { elem1: "rad_glass", chance: 0.33 },
      rad_steam: { elem1: "rad_glass", chance: 0.33 },
      fallout: { elem1: "rad_glass", elem2: "radiation", chance: 0.1 },
      uranium: { elem1: "rad_glass", chance: 0.01 }
    },
    colorKey: {
          g: "#5e807d",
          s: "#638f8b",
          S: "#679e99"
        },
    grain: 0
  },
  "molten_glass": {
    reactions: {
      radiation: { elem1: "molten_rad_glass", chance: 0.66 },
      rad_steam: { elem1: "molten_rad_glass", chance: 0.33 },
      molten_uranium: { elem1: "molten_rad_glass" },
      fallout: { elem1: "molten_rad_glass", elem2: "radiation" },
      rust: { elem1: "molten_stained_glass", attr1: {
                colorstart: 0
              } },
      molten_iron: { elem1: "molten_stained_glass", attr1: {
                colorstart: 0
              } },
      molten_bronze: { elem1: "molten_stained_glass", attr1: {
                colorstart: 38
              } },
      mercury: { elem1: "molten_stained_glass", attr1: {
                colorstart: 45
              } },
      mercury_gas: { elem1: "molten_stained_glass", attr1: {
                colorstart: 45
              } },
      molten_sulfur: { elem1: "molten_stained_glass", attr1: {
                colorstart: 60
              } },
      sulfur_gas: { elem1: "molten_stained_glass", attr1: {
                colorstart: 60
              } },
      molten_copper: { elem1: "molten_stained_glass", attr1: {
                colorstart: 150
              } },
      oxidized_copper: { elem1: "molten_stained_glass", attr1: {
                colorstart: 150
              } },
      molten_nickel: { elem1: "molten_stained_glass", attr1: {
                colorstart: 240
              } },
      molten_purple_gold: { elem1: "molten_stained_glass", attr1: {
                colorstart: 280
              } },
      molten_rose_gold: { elem1: "molten_stained_glass", attr1: {
                colorstart: 300
              } },
      molten_gold: { elem1: "molten_stained_glass", attr1: {
                colorstart: 320
              } },
      gold_coin: { elem1: "molten_stained_glass", attr1: {
                colorstart: 320
              } }
    },
    grain: 0
  },
  "molten_rad_glass": {
    color: [
          "#bcc83e",
          "#bca83e",
          "#bc9c00",
          "#bcc83e",
          "#bcbc3e"
        ],
    behavior: [
      ["XX", "CR:fire,fire,fire,radiation%4.5", "XX"],
      ["M2 AND CR:radiation%1", "XX", "M2 AND CR:radiation%1"],
      ["M1", "M1", "M1"]
    ],
    grain: 0
  },
  "rad_glass": {
    color: [
          "#648c64",
          "#648c64",
          "#6aad83",
          "#648c64",
          "#648c64"
        ],
    behavior: [
          "XX|CR:radiation%0.075|XX",
          "CR:radiation%0.075|XX|CR:radiation%0.075",
          "XX|CR:radiation%0.075|XX"
        ],
    category: "solids",
    state: "solid",
    density: 2500,
    tempHigh: 1500,
    hidden: true,
    breakInto: "rad_shard",
    noMix: true,
    colorKey: {
          g: "#648c64",
          s: "#679D74",
          S: "#6aad83"
        },
    grain: 0.3
  },
  // -------------------- FOOD --------------------

  "meat": {
    color: [
          "#9e4839",
          "#ba6449",
          "#d2856c",
          "#a14940"
        ],
    behavior: [
          "XX|XX|XX",
          "SP|XX|SP",
          "XX|M1|XX"
        ],
    category: "food",
    state: "solid",
    density: 1019.5,
    tempHigh: 100,
    tempLow: -18,
    stateHigh: "cooked_meat",
    stateLow: "frozen_meat",
    conduct: 0.2,
    burn: 15,
    burnTime: 200,
    burnInto: "cooked_meat",
    reactions: {
      dirty_water: { elem1: "rotten_meat", chance: 0.1 },
      fly: { elem1: "rotten_meat", chance: 0.2 },
      dioxin: { elem1: "rotten_meat", chance: 0.1 },
      uranium: { elem1: "rotten_meat", chance: 0.1 },
      cancer: { elem1: "rotten_meat", chance: 0.1 },
      plague: { elem1: "rotten_meat", chance: 0.3 },
      ant: { elem1: "rotten_meat", chance: 0.1 },
      worm: { elem1: "rotten_meat", chance: 0.1 },
      rat: { elem1: "rotten_meat", chance: 0.3 },
      mushroom_spore: { elem1: "rotten_meat", chance: 0.1 },
      mushroom_stalk: { elem1: "rotten_meat", chance: 0.1 },
      mycelium: { elem1: "rotten_meat", chance: 0.1 },
      hyphae: { elem1: "rotten_meat", chance: 0.1 },
      mercury: { elem1: "rotten_meat", chance: 0.2 },
      mercury_gas: { elem1: "rotten_meat", chance: 0.1 },
      virus: { elem1: "rotten_meat", chance: 0.1 },
      poison: { elem1: "rotten_meat", chance: 0.5 },
      infection: { elem1: "rotten_meat", chance: 0.1 },
      ink: { elem1: "rotten_meat", chance: 0.1 },
      acid: { elem1: "rotten_meat", chance: 0.5 },
      acid_gas: { elem1: "rotten_meat", chance: 0.4 },
      cyanide: { elem1: "rotten_meat", chance: 0.5 },
      cyanide_gas: { elem1: "rotten_meat", chance: 0.5 },
      rotten_cheese: { elem1: "rotten_meat", chance: 0.02 },
      fallout: { elem1: "rotten_meat", chance: 0.2 },
      slime: { elem1: "rotten_meat", chance: 0.2 },
      water: { elem2: "broth", tempMin: 70 },
      salt_water: { elem2: "broth", tempMin: 70 },
      sugar_water: { elem2: "broth", tempMin: 70 },
      seltzer: { elem2: "broth", tempMin: 70 },
      salt: { elem1: "cured_meat" },
      vinegar: { elem1: "cured_meat", chance: 0.1 }
    },
    isFood: true
  },
  "rotten_meat": {
    color: [
          "#b8b165",
          "#b89765"
        ],
    behavior: [
          "XX|CR:plague,stench,stench,stench,fly%0.25 AND CH:meat>rotten_meat%1|XX",
          "SP%99 AND CH:meat>rotten_meat%1|XX|SP%99 AND CH:meat>rotten_meat%1",
          "XX|M1 AND CH:meat>rotten_meat%1|XX"
        ],
    category: "food",
    state: "solid",
    density: 1005,
    tempHigh: 300,
    stateHigh: [
          "plague",
          "ash",
          "ammonia"
        ],
    hidden: true,
    conduct: 0.1,
    burn: 12,
    burnTime: 200,
    burnInto: [
          "plague",
          "ash",
          "ammonia"
        ],
    reactions: {
      water: { elem2: "broth", tempMin: 70, color2: "#d7db69" },
      salt_water: { elem2: "broth", tempMin: 70, color2: "#d7db69" },
      sugar_water: { elem2: "broth", tempMin: 70, color2: "#d7db69" },
      dirty_water: { elem2: "broth", tempMin: 70, color2: "#d7db69" },
      seltzer: { elem2: "broth", tempMin: 70, color2: "#d7db69" }
    },
    isFood: true
  },
  "cured_meat": {
    color: [
          "#be5c4b",
          "#c8846f",
          "#dda592",
          "#bc6157"
        ],
    behavior: [
          "XX|XX|XX",
          "SP|XX|SP",
          "XX|M1|XX"
        ],
    category: "food",
    state: "solid",
    density: 1019.5,
    tempHigh: 100,
    stateHigh: "cooked_meat",
    hidden: true,
    conduct: 0.3,
    burn: 15,
    burnTime: 200,
    burnInto: "cooked_meat",
    reactions: {
      water: { elem2: "broth", tempMin: 70 },
      salt_water: { elem2: "broth", tempMin: 70 },
      sugar_water: { elem2: "broth", tempMin: 70 },
      seltzer: { elem2: "broth", tempMin: 70 }
    },
    isFood: true
  },
  "cooked_meat": {
    color: [
          "#ae7d5b",
          "#9b6d54",
          "#7e4d31"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1005,
    tempHigh: 300,
    stateHigh: "ash",
    hidden: true,
    burn: 10,
    burnTime: 200,
    burnInto: "ash",
    reactions: {
      water: { elem2: "broth", tempMin: 70 },
      salt_water: { elem2: "broth", tempMin: 70 },
      sugar_water: { elem2: "broth", tempMin: 70 },
      dirty_water: { elem2: "broth", tempMin: 70, color2: "#d7db69" },
      seltzer: { elem2: "broth", tempMin: 70 }
    },
    isFood: true
  },
  "frozen_meat": {
    color: [
          "#399e8f",
          "#49baa9",
          "#6cd2c6",
          "#40a197"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1067.5,
    temp: -18,
    tempHigh: 0,
    stateHigh: "meat",
    hidden: true,
    isFood: true
  },
  "salt": {
    color: [
          "#f2f2f2",
          "#e0e0e0"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 2160,
    tempHigh: 801,
    stateHigh: "molten_salt",
    fireColor: "#F1E906",
    alias: "sodium chloride",
    reactions: {
      ice: { elem2: "salt_water", chance: 0.1 },
      rime: { elem2: "salt_water", chance: 0.075 },
      snow: { elem2: "salt_water", chance: 0.25 },
      packed_snow: { elem2: "salt_water", chance: 0.05 },
      packed_ice: { elem2: "salt_water", chance: 0.01 },
      aluminum: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.0025 },
      zinc: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.015 },
      steel: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.0125 },
      iron: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.0125 },
      tin: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.01 },
      brass: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.001 },
      bronze: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.001 },
      copper: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.0075 },
      silver: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.0075 },
      gold: { elem1: [
                "sodium",
                "chlorine"
              ], charged: true, chance: 0.0075 }
    },
    isFood: true
  },
  "molten_salt": {
    conduct: 0.1,
    alias: "molten sodium chloride",
    reactions: {
      water: { elem1: "explosion" }
    }
  },
  "sugar": {
    color: "#f2f2f2",
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 1590,
    tempHigh: 186,
    stateHigh: "caramel",
    reactions: {
      grape: { elem2: "jelly", chance: 0.005, tempMin: 100 }
    },
    isFood: true
  },
  "flour": {
    color: [
          "#f0e2b7",
          "#f0e4c0",
          "#ded1ab"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 600,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 40,
    burnTime: 25,
    reactions: {
      water: { elem1: "dough" },
      salt_water: { elem1: "dough" },
      sugar_water: { elem1: "dough" },
      seltzer: { elem1: "dough" },
      pool_water: { elem1: "dough" },
      juice: { elem1: "dough" },
      vinegar: { elem1: "dough" },
      yolk: { elem1: "batter" },
      yogurt: { elem1: "batter" },
      honey: { elem1: "gingerbread" },
      molasses: { elem1: "gingerbread" },
      sap: { elem1: "gingerbread" },
      caramel: { elem1: "gingerbread" },
      broth: { elem1: "dough" },
      soda: { elem1: "dough" },
      tea: { elem1: "dough" },
      blood: { elem1: "dough" },
      infection: { elem1: "dough" },
      antibody: { elem1: "dough" },
      milk: { elem1: "dough" },
      cream: { elem1: "dough" }
    },
    isFood: true
  },
  // -------------------- MACHINES --------------------

  "wire": {
    color: "#4d0a03",
    behavior: behaveWall,
    category: "machines",
    density: 8960,
    conduct: 1,
    insulate: true,
    noMix: true
  },
  "battery": {
    color: "#9c6c25",
    behavior: behaveWall,
    category: "machines",
    state: "solid",
    density: 4449.5,
    tempHigh: 1455.5,
    stateHigh: [
          "molten_steel",
          "explosion",
          "acid_gas"
        ],
    breakInto: [
          "metal_scrap",
          "acid"
        ],
    hardness: 0.8,
    movable: false
  },
  "cloner": {
    color: "#dddd00",
    behavior: behaveCloner,
    category: "machines",
    hardness: 1,
    insulate: true,
    movable: false,
    ignore: [
          "ecloner",
          "slow_cloner",
          "clone_powder",
          "floating_cloner",
          "wall",
          "ewall"
        ],
    darkText: true,
    onClicked: null
  },
  "sensor": {
    color: "#bebfa3",
    category: "machines",
    conduct: 1,
    movable: false,
    ignore: [
          "flash"
        ],
    darkText: true
  },
  "heater": {
    color: "#881111",
    behavior: behaveWall,
    category: "machines",
    state: "solid",
    density: 1000,
    temp: 22,
    insulate: true,
    movable: false
  },
  "cooler": {
    color: "#111188",
    behavior: behaveWall,
    category: "machines",
    state: "solid",
    density: 1000,
    temp: 18,
    insulate: true,
    movable: false
  },
  // -------------------- SPECIAL --------------------

  "random": {
    color: [
          "#28BCD1",
          "#9335E6",
          "#E13294"
        ],
    behavior: behaveWall,
    category: "special",
    excludeRandom: true
  },
  "image": {
    color: [
          "#78bbff",
          "#5bb81a"
        ],
    behavior: behaveWall,
    category: "special",
    state: "solid",
    density: 100
  },
  // -------------------- EDIT --------------------

  "ruler": {
    color: [
          "#C99255",
          "#B6894C"
        ],
    category: "edit",
    canPlace: false,
    maxSize: 1,
    desc: "Use to measure lengths and angles on the canvas."
  },
  "group": {
    color: "#75ffef",
    category: "edit",
    canPlace: false,
    desc: "Use to combine pixels into a single structure."
  },
  "ungroup": {
    color: "#8a0010",
    category: "edit",
    canPlace: false,
    desc: "Use to remove pixels from a structure."
  },
  "unpaint": {
    color: [
          "#ffffff",
          "#000000"
        ],
    category: "edit",
    canPlace: false,
    desc: "Use on pixels to return their original color.",
    reactions: {
      color_sand: { elem2: "sand" },
      stained_glass: { elem2: "glass" },
      molten_stained_glass: { elem2: "molten_glass" },
      rainbow: { elem2: "art" },
      static: { elem2: "art" },
      border: { elem2: "wall" },
      color_smoke: { elem2: "smoke" },
      spray_paint: { elem2: "smoke" },
      dye: { elem2: "ink" },
      paint: {  }
    }
  },
  "uncharge": {
    color: "#0000ff",
    category: "edit",
    canPlace: false,
    desc: "Use on pixels to remove electric charge.",
    reactions: {
      electric: {  },
      lightning: {  },
      proton: { elem2: "neutron" },
      shock: {  }
    }
  },
  "unburn": {
    color: "#383645",
    category: "edit",
    canPlace: false,
    desc: "Use on pixels to stop burning.",
    reactions: {
      fire: { elem2: "smoke" },
      plasma: { elem2: "smoke" },
      ember: { elem2: "ash" },
      fw_ember: { elem2: "smoke" },
      torch: { elem2: "wood" }
    }
  },
  // -------------------- TOOLS --------------------

  "smash": {
    color: [
          "#666666",
          "#888888",
          "#666666"
        ],
    category: "tools",
    canPlace: false,
    desc: "Use on pixels to break them, if possible."
  },
  // -------------------- SPECIAL --------------------

  "void": {
    color: "#262626",
    category: "special",
    hardness: 1,
    insulate: true,
    movable: false,
    excludeRandom: true
  },
  "sun": {
    color: "#ffffbd",
    category: "special",
    state: "gas",
    temp: 5504,
    tempLow: -100,
    stateLow: "supernova",
    insulate: true,
    movable: false,
    canPlace: true,
    noMix: true,
    alias: "star",
    reactions: {
      hydrogen: { elem2: "helium", temp1: 5 },
      helium: { elem2: "carbon_dioxide", temp1: 5, tempMax: 3600 },
      carbon_dioxide: { elem2: "neon", temp1: 5, tempMax: 1800 }
    }
  },
  "torch": {
    color: "#d68542",
    behavior: [
          "XX|CR:fire|XX",
          "XX|XX|XX",
          "XX|XX|XX"
        ],
    category: "special",
    temp: 600,
    tempLow: -273,
    stateLow: "wood",
    breakInto: "sawdust",
    reactions: {
      water: { elem1: "wood" },
      sugar_water: { elem1: "wood" },
      salt_water: { elem1: "wood" },
      seltzer: { elem1: "wood" },
      dirty_water: { elem1: "wood" },
      pool_water: { elem1: "wood" },
      steam: { elem1: "wood" },
      smog: { elem1: "wood" },
      rain_cloud: { elem1: "wood" },
      cloud: { elem1: "wood" },
      snow_cloud: { elem1: "wood" },
      hail_cloud: { elem1: "wood" },
      thunder_cloud: { elem1: "wood" },
      ice_nine: { elem1: "wood" }
    }
  },
  "spout": {
    color: "#606378",
    behavior: [
          "XX|CR:water|XX",
          "CR:water|XX|CR:water",
          "XX|CR:water|XX"
        ],
    category: "special",
    tempHigh: 1455.5,
    stateHigh: "molten_steel",
    conduct: 0.42
  },
  "filler": {
    color: "#ae4cd9",
    category: "special",
    density: 1834,
    movable: false,
    excludeRandom: true,
    reactions: {
      neutron: { elem1: "lattice" },
      proton: { elem1: "vertical" },
      electric: { elem1: "horizontal" },
      positron: { elem1: "vertical" },
      plasma: { elem1: "armageddon", tempMin: 500, charged: true }
    },
    trackPaint: true
  },
  "lattice": {
    color: "#cb4cd9",
    behavior: [
          "CL|XX|CL",
          "XX|XX|XX",
          "CL|XX|CL"
        ],
    category: "special",
    density: 917,
    movable: false,
    excludeRandom: true,
    reactions: {
      cold_fire: { elem1: "ice_nine", chance: 0.1 },
      proton: { elem1: "filler", chance: 0.1 },
      electric: { elem2: "filler", chance: 0.1 }
    }
  },
  "ball": {
    color: "#e35693",
    behavior: [
          "XX|XX|XX",
          "XX|FY:0%5|XX",
          "XX|M1 AND BO|XX"
        ],
    category: "special",
    state: "solid",
    density: 1052,
    tempHigh: 250,
    stateHigh: "molten_plastic",
    hidden: true,
    flippableY: true,
    flipY: false
  },
  "balloon": {
    color: [
          "#fe4a75",
          "#267cb0",
          "#1a743c",
          "#ff6ffa",
          "#eaede5",
          "#1dc9f3",
          "#ff0101",
          "#f4cd32",
          "#bee347",
          "#fab937",
          "#91c7cc"
        ],
    behavior: [
          "M1%50|M1%50|M1%50",
          "M2%5|XX|M2%5",
          "M2%5|M2%5|M2%5"
        ],
    category: "special",
    state: "solid",
    density: 0.164,
    tempHigh: 120,
    tempLow: -272.2,
    stateHigh: "pop",
    stateLow: "pop",
    burn: 20,
    burnTime: 2,
    burnInto: "pop",
    breakInto: [
          "confetti",
          "helium",
          "helium",
          "helium",
          "pop"
        ],
    buttonColor: [
          "#ff8080",
          "#ff2626"
        ],
    reactions: {
      cloud: { elem1: "pop" },
      rain_cloud: { elem1: "pop" },
      snow_cloud: { elem1: "pop" },
      thunder_cloud: { elem1: "pop" },
      hail_cloud: { elem1: "pop" },
      acid_cloud: { elem1: "pop" },
      ozone: { elem1: "pop" }
    }
  },
  // -------------------- LAND --------------------

  "gravel": {
    color: [
          "#e3e0df",
          "#b1aba3",
          "#74736d",
          "#524b47"
        ],
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 1680,
    tempHigh: 950,
    stateHigh: "magma",
    breakInto: "sand",
    hardness: 0.2,
    reactions: {
      broth: { elem2: "water", chance: 0.01 },
      tea: { elem2: "water", chance: 0.01 }
    }
  },
  // -------------------- LIQUIDS --------------------

  "slime": {
    color: "#81cf63",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1450,
    tempHigh: 120,
    tempLow: 0,
    stateHigh: "steam",
    viscosity: 5000,
    stain: 0.05
  },
  "cement": {
    color: "#b5b5b5",
    behavior: behaveLiquid,
    category: "liquids",
    state: "solid",
    density: 1440,
    tempHigh: 1550,
    tempLow: -10,
    stateHigh: "magma",
    stateLow: "concrete",
    viscosity: 1000,
    hardness: 0.1,
    darkText: true
  },
  // -------------------- POWDERS --------------------

  "dust": {
    color: "#666666",
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 1490,
    tempHigh: 425,
    stateHigh: "fire",
    burn: 10,
    burnTime: 1
  },
  // -------------------- LIFE --------------------

  "cell": {
    color: [
          "#d6ee00",
          "#83ee00",
          "#00ee00"
        ],
    behavior: behaveLiquid,
    category: "life",
    state: "solid",
    density: 1000.1,
    tempHigh: 102,
    tempLow: -2,
    stateHigh: [
          "steam",
          "steam",
          "steam",
          "sugar"
        ],
    stateLow: [
          "ice",
          "ice",
          "ice",
          "sugar_ice"
        ],
    breakInto: [
          "water",
          "dna",
          "dna",
          "dna"
        ],
    reactions: {
      infection: { elem1: "infection", chance: 0.015 },
      blood: { elem1: "blood", chance: 0.01 },
      antibody: { elem1: "antibody", chance: 0.01 },
      sugar: { elem2: "cell", chance: 0.03 },
      sugar_water: { elem2: "cell", chance: 0.04 },
      alcohol: { elem1: [
                null,
                "dna"
              ], chance: 0.02 },
      poison: { chance: 0.02 },
      plague: { chance: 0.02 },
      mercury: { chance: 0.02 },
      chlorine: { chance: 0.02 },
      cyanide: { chance: 0.02 },
      soap: { chance: 0.015 },
      oxygen: { elem2: "carbon_dioxide", chance: 0.05 },
      ammonia: { elem2: "nitrogen", chance: 0.05 },
      oil: { elem2: "methane", chance: 0.001 },
      milk: { elem2: "yogurt", chance: 0.01 },
      cream: { elem2: "yogurt", chance: 0.01 },
      chocolate_milk: { elem2: "yogurt", chance: 0.01, color2: "#4c392c" },
      fruit_milk: { elem2: "yogurt", chance: 0.01, color2: "#977871" },
      pilk: { elem2: "yogurt", chance: 0.01, color2: "#bba789" },
      eggnog: { elem2: "yogurt", chance: 0.01, color2: "#ae9a7e" }
    }
  },
  "cancer": {
    color: [
          "#870c71",
          "#5c114e",
          "#300b29"
        ],
    behavior: behaveLiquid,
    category: "life",
    state: "solid",
    density: 1000.2,
    tempHigh: 80,
    tempLow: -30,
    stateHigh: "plague",
    stateLow: "dirty_water",
    hidden: true,
    breakInto: "dna",
    reactions: {
      cell: { elem2: "cancer", chance: 0.005 },
      frog: { elem2: "cancer", chance: 0.005 },
      tadpole: { elem2: "cancer", chance: 0.005 },
      fish: { elem2: "cancer", chance: 0.005 },
      rat: { elem2: "cancer", chance: 0.005 },
      bird: { elem2: "cancer", chance: 0.005 },
      homunculus: { elem2: "cancer", chance: 0.005 },
      bone: { elem2: "cancer", chance: 0.005 },
      bone_marrow: { elem2: "cancer", chance: 0.005 },
      skin: { elem2: "cancer", chance: 0.005 },
      sugar: { elem2: "cancer", chance: 0.04 },
      sugar_water: { elem2: "cancer", chance: 0.05 },
      alcohol: { elem1: [
                null,
                "dna"
              ], chance: 0.01 },
      poison: { chance: 0.01 },
      plant: { elem2: [
                "dead_plant",
                null
              ], chance: 0.005 },
      grass: { elem2: [
                "dead_plant",
                null
              ], chance: 0.005 },
      proton: { chance: 0.04 },
      laser: { chance: 0.04 }
    },
    breakIntoColor: [
          "#c9b7b7",
          "#c9c6b7",
          "#c9c6b7",
          "#b7c8c9",
          "#c9b7c5"
        ],
    nocheer: true
  },
  "plague": {
    color: "#36005c",
    behavior: [
          "M2|M1|M2",
          "M1|DL%1|M1",
          "M2|M1|M2"
        ],
    category: "life",
    state: "gas",
    density: 600,
    tempHigh: 300,
    reactions: {
      frog: { elem2: "plague", chance: 0.05 },
      ant: { elem2: "plague", chance: 0.05 },
      bee: { elem2: "plague", chance: 0.05 },
      fish: { elem2: "plague", chance: 0.05 },
      firefly: { elem2: "plague", chance: 0.05 },
      chlorine: {  },
      liquid_chlorine: {  },
      light: {  },
      head: { stain2: "#546e00" }
    }
  },
  "dna": {
    color: [
          "#ffe3e3",
          "#e3e3ff",
          "#ffffe3",
          "#e3ffe3"
        ],
    behavior: behavePowder,
    category: "life",
    state: "solid",
    density: 1700,
    tempHigh: 190,
    stateHigh: "smoke",
    hidden: true,
    alias: "deoxyribonucleic acid",
    reactions: {
      fire: {  },
      radiation: { color1: [
                "#ffe3e3",
                "#e3e3ff",
                "#ffffe3",
                "#e3ffe3"
              ] },
      neutron: { color1: [
                "#ffe3e3",
                "#e3e3ff",
                "#ffffe3",
                "#e3ffe3"
              ] }
    }
  },
  "worm": {
    color: "#d34c37",
    behavior: [
          "SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,mulch,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3|XX|SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,mulch,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3",
          "M2%10|XX|M2%10",
          "SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,mulch,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3|M1|SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,mulch,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3"
        ],
    category: "life",
    state: "solid",
    density: 1050,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "frozen_worm",
    conduct: 0.17,
    burn: 20,
    burnTime: 50,
    breakInto: "slime",
    reactions: {
      ash: { elem2: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "dirt"
              ], chance: 0.1, func: null },
      crumb: { elem2: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "dirt"
              ], chance: 0.1, func: null },
      feather: { elem2: [
                null,
                null,
                null,
                null,
                "dirt"
              ], chance: 0.1, func: null },
      root: { elem2: "dirt", chance: 0.1, func: null },
      dead_plant: { elem2: "dirt", chance: 0.1, func: null },
      tinder: { elem2: [
                null,
                "dirt"
              ], chance: 0.1, func: null },
      sawdust: { elem2: [
                null,
                null,
                null,
                null,
                "dirt"
              ], chance: 0.1, func: null },
      dust: { chance: 0.1, func: null },
      rotten_meat: { chance: 0.05, func: null },
      dead_bug: { elem2: "dirt", chance: 0.1, func: null },
      hyphae: { elem2: "mycelium", chance: 0.1, func: null },
      plant: { elem2: "dirt", chance: 0.01, func: null },
      fiber: { elem2: "dirt", chance: 0.01, func: null },
      evergreen: { elem2: "dirt", chance: 0.01, func: null },
      petal: { elem2: "dirt", chance: 0.01, func: null },
      pistil: { elem2: "dirt", chance: 0.01, func: null },
      vine: { elem2: "dirt", chance: 0.01, func: null },
      herb: { elem2: "dirt", chance: 0.1, func: null },
      rice: { elem2: "dirt", chance: 0.01, func: null },
      coffee_ground: { elem2: "dirt", chance: 0.1, func: null },
      nut: { elem2: "dirt", chance: 0.05, func: null },
      yolk: { chance: 0.01, func: null },
      charcoal: { elem2: "dirt", chance: 0.05, func: null },
      straw: { elem2: "dirt", chance: 0.05, func: null },
      lettuce: { elem2: "dirt", chance: 0.01, func: null },
      tomato: { elem2: "dirt", chance: 0.01, func: null },
      corn: { elem2: "dirt", chance: 0.01, func: null },
      pickle: { elem2: "dirt", chance: 0.01, func: null },
      rotten_cheese: { elem2: "dirt", chance: 0.01, func: null },
      bread: { elem2: "dirt", chance: 0.01, func: null },
      toast: { elem2: "dirt", chance: 0.01, func: null },
      flour: { elem2: "dough", chance: 0.01 },
      dough: { elem2: "dirt", chance: 0.01, func: null },
      paper: { elem2: "cellulose", chance: 0.01 },
      confetti: { elem2: "cellulose", chance: 0.01 },
      cellulose: { elem2: [
                null,
                "dirt"
              ], chance: 0.01, func: null },
      potato: { elem2: "mashed_potato", chance: 0.01 },
      mashed_potato: { elem2: "dirt", chance: 0.01, func: null },
      mudstone: { elem2: "dirt", chance: 0.1 },
      adobe: { elem2: "dirt", chance: 0.01, func: null },
      permafrost: { elem2: "dirt", chance: 0.1 },
      packed_sand: { elem2: "sand", chance: 0.1 },
      lichen: { elem2: "dirt", chance: 0.0025 },
      salt: { elem1: "slime" },
      potassium_salt: { elem1: "slime" },
      epsom_salt: { elem1: "slime" },
      alcohol: { chance: 0.005 }
    }
  },
  "frozen_worm": {
    color: "#37d3b6",
    behavior: behaveSturdyPowder,
    category: "life",
    state: "solid",
    density: 1050,
    temp: -20,
    tempHigh: 5,
    stateHigh: "worm",
    hidden: true,
    conduct: 0.17,
    breakInto: "slime"
  },
  "flea": {
    color: "#9e4732",
    behavior: [
          "M2|XX|M2",
          "XX|XX|XX",
          "M2|M1|M2"
        ],
    category: "life",
    state: "solid",
    density: 400,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 0.15,
    burn: 95,
    burnTime: 25,
    breakInto: [
          "dust",
          "dead_bug"
        ],
    reactions: {
      blood: { chance: 0.1875, func: null },
      infection: { chance: 0.1875, func: null },
      antibody: { chance: 0.1874, func: null },
      antidote: { chance: 0.15, func: null },
      dead_plant: { chance: 0.05, func: null },
      ketchup: { chance: 0.1 },
      plant: { chance: 0.1 },
      hair: { chance: 0.01 },
      mercury: { chance: 0.1875 },
      vinegar: { elem1: "dead_bug" },
      alcohol: { elem1: "dead_bug" },
      mayo: { elem1: "dead_bug", chance: 0.025 }
    }
  },
  "termite": {
    color: "#f5a056",
    behavior: [
          "XX|XX|SW:wood,tree_branch,dirt,sand,gravel,clay_soil%5",
          "XX|FX%3|M2%15 AND BO",
          "XX|M1|SW:wood,tree_branch,dirt,sand,gravel,clay_soil%5"
        ],
    category: "life",
    state: "solid",
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 0.15,
    burn: 95,
    burnTime: 25,
    breakInto: "dead_bug",
    foodNeed: 20,
    reactions: {
      wood: { chance: 0.04, func: null },
      tree_branch: { chance: 0.02, func: null },
      cellulose: { chance: 0.04, func: null },
      paper: { chance: 0.04, func: null },
      bamboo: { chance: 0.03, func: null },
      bamboo_plant: { chance: 0.04, func: null },
      sapling: { chance: 0.025, func: null },
      sawdust: { chance: 0.025, func: null },
      mulch: { elem2: "dirt", chance: 0.025, func: null },
      confetti: { chance: 0.025, func: null },
      wheat: { chance: 0.025, func: null },
      straw: { chance: 0.025, func: null },
      particleboard: { chance: 0.025, func: null },
      tinder: { chance: 0.025, func: null },
      lichen: { chance: 0.025, func: null },
      nut: { elem2: [
                "nut_meat",
                null
              ], chance: 0.025, func: null },
      vinegar: { elem1: "dead_bug" },
      alcohol: { elem1: "dead_bug" }
    }
  },
  "ant": {
    color: "#5e0b04",
    behavior: behaveCrawler,
    category: "life",
    state: "solid",
    density: 500,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 0.05,
    burn: 95,
    burnTime: 25,
    breakInto: "dead_bug",
    reactions: {
      wheat: { chance: 0.1, func: null },
      caramel: { chance: 0.15, func: null },
      bread: { chance: 0.05, func: null },
      sugar_water: { chance: 0.15, func: null },
      honey: { chance: 0.1, func: null },
      soda: { chance: 0.15, func: null },
      juice: { chance: 0.15, func: null },
      sugar: { chance: 0.1, func: null },
      rotten_meat: { chance: 0.05, func: null },
      crumb: { chance: 0.05, func: null },
      cheese: { chance: 0.05, func: null },
      cheese_powder: { chance: 0.05, func: null },
      rotten_cheese: { chance: 0.05, func: null },
      dead_bug: { chance: 0.05, func: null },
      vinegar: { elem1: "dead_bug" },
      alcohol: { elem1: "dead_bug" },
      oil: { elem1: "dead_bug", chance: 0.2 },
      mushroom_cap: { chance: 0.025, func: null },
      candy: { chance: 0.025, func: null },
      pumpkin: { chance: 0.025, func: null },
      pumpkin_seed: { chance: 0.05, func: null },
      nut_butter: { chance: 0.01, func: null },
      jelly: { chance: 0.02, func: null }
    }
  },
  "spider": {
    color: "#4f2d2d",
    behavior: behaveCrawler,
    category: "life",
    state: "solid",
    density: 500,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 0.05,
    burn: 95,
    burnTime: 25,
    breakInto: "dead_bug",
    cooldown: 30,
    foodNeed: 4,
    reactions: {
      dead_bug: { chance: 0.1, func: null },
      bleach: { elem1: "dead_bug", chance: 0.1 },
      alcohol: { elem1: "dead_bug", chance: 0.05 },
      vinegar: { elem1: "dead_bug", chance: 0.03 }
    }
  },
  "web": {
    color: [
          "#d7d9d1",
          "#c0c3b6",
          "#a8ac9a"
        ],
    behavior: behaveWall,
    category: "life",
    state: "solid",
    tempHigh: 220,
    stateHigh: "smoke",
    hidden: true,
    burn: 15,
    burnTime: 30,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: [
          null,
          null,
          "dust"
        ],
    reactions: {
      fly: { elem2: "dead_bug", chance: 0.1 },
      flea: { elem2: "dead_bug", chance: 0.1 },
      termite: { elem2: "dead_bug", chance: 0.05 },
      ant: { elem2: "dead_bug", chance: 0.05 },
      firefly: { elem2: "dead_bug", chance: 0.1 },
      stink_bug: { elem2: [
                "dead_bug",
                "stench"
              ], chance: 0.035 },
      bee: { elem2: "dead_bug", chance: 0.02 },
      bleach: { chance: 0.1 },
      vinegar: { chance: 0.05 },
      juice: { chance: 0.03 },
      soap: { chance: 0.2 },
      rock: { chance: 0.2 },
      basalt: { chance: 0.2 }
    }
  },
  "fly": {
    color: "#4c4e42",
    behavior: behaveFly,
    category: "life",
    state: "solid",
    density: 600,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 1,
    burn: 95,
    burnTime: 25,
    breakInto: "dead_bug",
    behaviorOn: [
          "XX|CR:flash|XX",
          "CR:flash|CH:ash|CR:flash",
          "XX|CR:flash|XX"
        ],
    foodNeed: 15,
    reactions: {
      dead_plant: { chance: 0.15, func: null },
      meat: { chance: 0.15, func: null },
      cooked_meat: { chance: 0.15, func: null },
      rotten_meat: { elem2: [
                null,
                null,
                "ammonia"
              ], chance: 0.15, func: null },
      cheese: { elem2: [
                null,
                null,
                "ammonia"
              ], chance: 0.15, func: null },
      cheese_powder: { elem2: [
                null,
                null,
                "ammonia"
              ], chance: 0.15, func: null },
      rotten_cheese: { elem2: [
                null,
                null,
                "ammonia"
              ], chance: 0.15, func: null },
      vine: { chance: 0.15, func: null },
      corn: { chance: 0.05, func: null },
      potato: { chance: 0.05, func: null },
      crumb: { chance: 0.05, func: null },
      wheat: { chance: 0.1, func: null },
      yeast: { chance: 0.15, func: null },
      caramel: { chance: 0.15, func: null },
      bread: { chance: 0.1, func: null },
      sugar_water: { chance: 0.15, func: null },
      honey: { chance: 0.15, func: null },
      soda: { chance: 0.15, func: null }
    }
  },
  "firefly": {
    color: "#684841",
    behavior: behaveFly,
    category: "life",
    state: "solid",
    density: 600,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 0.15,
    burn: 95,
    burnTime: 25,
    breakInto: "dead_bug",
    buttonColor: [
          "#684841",
          "#684841",
          "#d9d950",
          "#684841",
          "#684841"
        ],
    alias: "lightning bug",
    reactions: {
      pollen: { chance: 0.25, func: null },
      honey: { chance: 0.25, func: null },
      firefly: { chance: 0.01, func: null },
      sugar_water: { chance: 0.25, func: null },
      soda: { chance: 0.25, func: null },
      sugar: { chance: 0.15, func: null }
    }
  },
  "bee": {
    color: "#c4b100",
    behavior: behaveFly,
    category: "life",
    state: "solid",
    density: 600,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "ash",
    stateLow: "dead_bug",
    conduct: 0.15,
    burn: 95,
    burnTime: 25,
    breakInto: [
          "dead_bug",
          "honey"
        ],
    egg: "honey",
    reactions: {
      sugar_water: { chance: 0.25, func: null },
      soda: { chance: 0.25, func: null },
      sugar: { chance: 0.15, func: null },
      honey: { chance: 0.15, func: null },
      yeast: { chance: 0.15, func: null },
      caramel: { chance: 0.25, func: null },
      candy: { chance: 0.05, func: null },
      oil: { elem1: "dead_bug", chance: 0.2 }
    }
  },
  "hive": {
    color: "#a6a479",
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 900,
    tempHigh: 300,
    stateHigh: [
          "fire",
          "fire",
          "fire",
          "ash"
        ],
    hidden: true,
    burn: 70,
    burnTime: 300,
    burnInto: [
          "fire",
          "fire",
          "fire",
          "ash"
        ],
    breakInto: [
          null,
          null,
          "honey",
          "wax"
        ],
    movable: false,
    properties: {
          bees: [],
          hive: 0,
          honey: 0
        }
  },
  "stink_bug": {
    color: [
          "#56482d",
          "#52472c",
          "#635443"
        ],
    behavior: behaveFly,
    category: "life",
    state: "solid",
    density: 600,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "stench",
    stateLow: "dead_bug",
    conduct: 0.15,
    burn: 95,
    burnTime: 25,
    burnInto: "stench",
    breakInto: [
          "stench",
          "dead_bug"
        ],
    flippableX: true,
    properties: {
          phase: 1
        },
    reactions: {
      petal: { chance: 0.2, func: null },
      pistil: { chance: 0.2, func: null },
      grape: { chance: 0.05, func: null },
      plant: { chance: 0.1, func: null },
      beans: { chance: 0.05, func: null }
    }
  },
  "dead_bug": {
    color: [
          "#38302a",
          "#403732",
          "#453a2e",
          "#241d15",
          "#242e23"
        ],
    behavior: behaveSturdyPowder,
    category: "life",
    state: "solid",
    density: 600,
    tempHigh: 100,
    stateHigh: "ash",
    hidden: true,
    burn: 95,
    burnTime: 25,
    burnInto: [
          "smoke",
          "smoke",
          "ash"
        ],
    reactions: {
      water: { elem2: "foam", attr2: {
                clone: "water"
              }, color2: "#e3d8ca", chance: 0.001 },
      salt_water: { elem2: "foam", attr2: {
                clone: "salt_water"
              }, color2: "#e3d8ca", chance: 0.001 }
    }
  },
  "human": {
    color: [
          "#f3e7db",
          "#f7ead0",
          "#eadaba",
          "#d7bd96",
          "#a07e56",
          "#825c43",
          "#604134",
          "#3a312a"
        ],
    category: "life",
    state: "solid",
    density: 985,
    behavior: behaveWall,
    cooldown: 30,
    forceSaveColor: true,
    properties: {
          dead: false,
          dir: 1,
          panic: 0
        },
    reactions: {
      fire: { attr1: {
                panic: 5
              } },
      plasma: { attr1: {
                panic: 5
              } },
      cold_fire: { attr1: {
                panic: 5
              } },
      electric: { attr1: {
                panic: 5
              } },
      blood: { attr1: {
                panic: 1
              } },
      infection: { attr1: {
                panic: 2
              } },
      cancer: { attr1: {
                panic: 3
              } },
      plague: { attr1: {
                panic: 5
              } },
      radiation: { attr1: {
                panic: 5
              } },
      tnt: { attr1: {
                panic: 5
              } },
      dynamite: { attr1: {
                panic: 5
              } },
      c4: { attr1: {
                panic: 5
              } },
      grenade: { attr1: {
                panic: 5
              } },
      gunpowder: { attr1: {
                panic: 5
              } },
      acid: { attr1: {
                panic: 5
              } },
      acid_gas: { attr1: {
                panic: 5
              } },
      stench: { attr1: {
                panic: 2
              } }
    },
    related: [
          "body",
          "head"
        ]
  },
  "body": {
    color: [
          "#069469",
          "#047e99",
          "#7f5fb0"
        ],
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 1500,
    temp: 37,
    tempHigh: 150,
    tempLow: -30,
    stateHigh: "cooked_meat",
    stateLow: "frozen_meat",
    hidden: true,
    conduct: 0.05,
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: [
          "blood",
          "meat",
          "bone"
        ],
    forceSaveColor: true,
    properties: {
          dead: false,
          dir: 1,
          panic: 0
        },
    pickElement: "human",
    reactions: {
      cancer: { elem1: "cancer", chance: 0.005 },
      radiation: { elem1: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.4 },
      neutron: { elem1: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.01 },
      fallout: { elem1: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.01 },
      plague: { elem1: "plague", chance: 0.05 },
      egg: { elem2: "yolk", chance: 0.5, oneway: true },
      grape: { elem2: "juice", chance: 0.5, color2: "#291824", oneway: true },
      ant: { elem2: "dead_bug", chance: 0.05, oneway: true },
      spider: { elem2: "dead_bug", oneway: true },
      fly: { elem2: "dead_bug", oneway: true },
      firefly: { elem2: "dead_bug", oneway: true },
      bee: { elem2: "dead_bug", oneway: true },
      flea: { elem2: "dead_bug", oneway: true },
      termite: { elem2: "dead_bug", oneway: true },
      worm: { elem2: "slime", chance: 0.05, oneway: true },
      stink_bug: { elem2: "stench", oneway: true },
      grass_seed: { chance: 0.05 },
      gold_coin: { chance: 0.05 },
      diamond: { chance: 0.05 },
      sun: { elem1: "cooked_meat" },
      alcohol: { chance: 0.2, attr1: {
                panic: 0
              } },
      anesthesia: { attr1: {
                panic: 0
              } },
      alcohol_gas: { chance: 0.2, attr1: {
                panic: 0
              } }
    }
  },
  "head": {
    color: [
          "#f3e7db",
          "#f7ead0",
          "#eadaba",
          "#d7bd96",
          "#a07e56",
          "#825c43",
          "#604134",
          "#3a312a"
        ],
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 1080,
    temp: 37,
    tempHigh: 150,
    tempLow: -30,
    stateHigh: "cooked_meat",
    stateLow: "frozen_meat",
    hidden: true,
    conduct: 0.05,
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: [
          "blood",
          "meat",
          "bone"
        ],
    forceSaveColor: true,
    properties: {
          dead: false
        },
    pickElement: "human",
    reactions: {
      cancer: { elem1: "cancer", chance: 0.005 },
      radiation: { elem1: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.4 },
      neutron: { elem1: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.03 },
      fallout: { elem1: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.03 },
      plague: { elem1: "plague", chance: 0.05 },
      oxygen: { elem2: "carbon_dioxide", chance: 0.5 },
      beans: { elem2: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "stench"
              ], chance: 0.2 },
      sun: { elem1: "cooked_meat" },
      light: { stain1: "#825043" },
      bee: { stain1: "#cc564b", chance: 0.2 },
      water: { elem2: "bubble", attr2: {
                clone: "water"
              }, chance: 0.001 },
      salt_water: { elem2: "bubble", attr2: {
                clone: "salt_water"
              }, chance: 0.001 },
      pool_water: { elem2: "bubble", attr2: {
                clone: "pool_water"
              }, chance: 0.001 },
      alcohol: { chance: 0.2, attr1: {
                panic: 0
              } },
      anesthesia: { attr1: {
                panic: 0
              } },
      alcohol_gas: { chance: 0.2, attr1: {
                panic: 0
              } }
    }
  },
  "bird": {
    color: "#997457",
    behavior: behaveFly,
    category: "life",
    state: "solid",
    density: 400,
    temp: 41,
    tempHigh: 120,
    tempLow: -18,
    stateHigh: "cooked_meat",
    stateLow: "frozen_meat",
    conduct: 0.5,
    burn: 2,
    burnTime: 100,
    breakInto: [
          "feather",
          "blood"
        ],
    flippableX: true,
    properties: {
          phase: 2,
          rising: 0
        },
    foodNeed: 20,
    stateHighColor: "#E4CFB9",
    reactions: {
      fly: { chance: 0.25, func: null },
      firefly: { chance: 0.3, func: null },
      bee: { chance: 0.05, func: null },
      worm: { chance: 0.25, func: null },
      ant: { chance: 0.025, func: null },
      stink_bug: { elem2: "stench", chance: 0.025, func: null },
      dead_bug: { chance: 0.04, func: null },
      lichen: { chance: 0.04, func: null },
      termite: { chance: 0.025, func: null },
      flea: { chance: 0.025, func: null },
      mushroom_cap: { chance: 0.025, func: null },
      mushroom_gill: { chance: 0.025, func: null },
      seeds: { chance: 0.25, func: null },
      flower_seed: { chance: 0.25, func: null },
      wheat_seed: { chance: 0.25, func: null },
      corn_seed: { chance: 0.25, func: null },
      corn: { chance: 0.25, func: null },
      potato_seed: { chance: 0.25, func: null },
      grass_seed: { chance: 0.25, func: null },
      crumb: { chance: 0.25, func: null },
      pumpkin: { chance: 0.025, func: null },
      pumpkin_seed: { chance: 0.25, func: null },
      rice: { chance: 0.25, func: null },
      coffee_bean: { chance: 0.25, func: null },
      coffee_ground: { chance: 0.25, func: null },
      nut: { chance: 0.25, func: null },
      nut_meat: { chance: 0.25, func: null },
      nut_butter: { chance: 0.25, func: null },
      jelly: { chance: 0.25, func: null },
      spider: { chance: 0.1, func: null },
      web: { chance: 0.1, func: null },
      plague: { elem1: "plague", chance: 0.05 },
      oxygen: { elem2: "carbon_dioxide", chance: 0.5 }
    }
  },
  "rat": {
    color: [
          "#a698a9",
          "#8c7d82",
          "#ccc3cf"
        ],
    behavior: [
          "XX|M2%1.5|M2%5",
          "XX|FX%2 AND RL:plague%0.05|M2 AND BO",
          "XX|M1|M2"
        ],
    category: "life",
    state: "solid",
    density: 1450,
    temp: 37.6,
    tempHigh: 120,
    tempLow: -18,
    stateHigh: "rotten_meat",
    stateLow: "frozen_meat",
    conduct: 0.25,
    burn: 80,
    burnTime: 150,
    breakInto: [
          "infection",
          "rotten_meat"
        ],
    egg: "rat",
    reactions: {
      oxygen: { elem2: "carbon_dioxide", chance: 0.5 },
      meat: { chance: 0.1, func: null },
      cooked_meat: { chance: 0.1, func: null },
      cured_meat: { chance: 0.1, func: null },
      cheese: { chance: 0.2, func: null },
      cheese_powder: { chance: 0.2, func: null },
      rotten_cheese: { chance: 0.2, func: null },
      melted_cheese: { chance: 0.3, func: null },
      tomato: { chance: 0.1, func: null },
      sauce: { chance: 0.3, func: null },
      plant: { chance: 0.1, func: null },
      vine: { chance: 0.1, func: null },
      evergreen: { chance: 0.1, func: null },
      algae: { chance: 0.2, func: null },
      grass_seed: { chance: 0.3, func: null },
      wheat_seed: { chance: 0.3, func: null },
      wheat: { chance: 0.2, func: null },
      potato_seed: { chance: 0.3, func: null },
      potato: { chance: 0.1, func: null },
      corn_seed: { chance: 0.3, func: null },
      corn: { chance: 0.1, func: null },
      lichen: { chance: 0.1, func: null },
      flower_seed: { chance: 0.4, func: null },
      flour: { chance: 0.1, func: null },
      dough: { chance: 0.1, func: null },
      bread: { chance: 0.1, func: null },
      toast: { chance: 0.1, func: null },
      gingerbread: { chance: 0.15, func: null },
      rice: { chance: 0.1, func: null },
      yogurt: { chance: 0.15, func: null },
      beans: { chance: 0.15, func: null },
      salt: { chance: 0.1, func: null },
      sugar: { chance: 0.2, func: null },
      crumb: { chance: 0.1, func: null },
      herb: { chance: 0.1, func: null },
      salt_water: { elem2: "dirty_water", chance: 0.2 },
      sugar_water: { elem2: "dirty_water", chance: 0.2 },
      water: { elem2: "dirty_water", chance: 0.2 },
      popcorn: { chance: 0.3, func: null },
      candy: { chance: 0.3, func: null },
      caramel: { chance: 0.4, func: null },
      egg: { chance: 0.1, func: null },
      yolk: { chance: 0.2, func: null },
      hard_yolk: { chance: 0.15, func: null },
      eggnog: { chance: 0.2, func: null },
      milk: { chance: 0.2, func: null },
      grape: { chance: 0.25, func: null },
      batter: { chance: 0.25, func: null },
      baked_batter: { chance: 0.1, func: null },
      butter: { chance: 0.2, func: null },
      melted_butter: { chance: 0.3, func: null },
      lettuce: { chance: 0.2, func: null },
      baked_potato: { chance: 0.1, func: null },
      ice_cream: { chance: 0.2, func: null },
      cream: { chance: 0.3, func: null },
      pumpkin: { chance: 0.1, func: null },
      pumpkin_seed: { chance: 0.2, func: null },
      coffee_bean: { chance: 0.1, func: null },
      coffee_ground: { chance: 0.1, func: null },
      nut: { chance: 0.1, func: null },
      nut_meat: { chance: 0.1, func: null },
      nut_butter: { chance: 0.1, func: null },
      jelly: { chance: 0.1, func: null },
      worm: { chance: 0.1, func: null },
      ant: { chance: 0.1, func: null },
      spider: { chance: 0.1, func: null },
      frog: { chance: 0.005, func: null },
      snail: { elem2: "limestone", chance: 0.1, func: null },
      slug: { chance: 0.1, func: null }
    }
  },
  "frog": {
    color: "#607300",
    behavior: [
          "XX|XX|M2%3 AND SW:water,salt_water,sugar_water,dirty_water,seltzer%7",
          "XX|FX%0.5|CR:slime%0.01 AND BO",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1450,
    temp: 19.1,
    tempHigh: 100,
    tempLow: -18,
    stateHigh: "cooked_meat",
    stateLow: "frozen_frog",
    conduct: 0.2,
    burn: 15,
    burnTime: 300,
    breakInto: "slime",
    foodNeed: 10,
    eggColor: "#717c80",
    baby: "tadpole",
    stateHighColor: "#CDAF96",
    reactions: {
      fly: { chance: 0.5, func: null },
      firefly: { elem1: "meat", chance: 0.5 },
      stink_bug: { chance: 0.55, func: null },
      snail: { elem2: "limestone", chance: 0.05, func: null },
      slug: { chance: 0.2, func: null },
      worm: { chance: 0.2, func: null },
      spider: { chance: 0.2, func: null },
      algae: { chance: 0.5, func: null },
      kelp: { elem2: "water", chance: 0.5, func: null },
      oxygen: { elem2: "carbon_dioxide", chance: 0.5 },
      dead_bug: { chance: 0.2, func: null },
      mercury: { elem1: "rotten_meat", chance: 0.1 },
      bleach: { elem1: "rotten_meat", chance: 0.1 },
      infection: { elem1: "rotten_meat", chance: 0.025 },
      uranium: { elem1: "rotten_meat", chance: 0.1 },
      cyanide: { elem1: "rotten_meat", chance: 0.1 },
      chlorine: { elem1: "meat", chance: 0.1 },
      alcohol: { elem1: "meat", chance: 0.025 },
      dirty_water: { elem1: "rotten_meat", chance: 0.0001 },
      pool_water: { elem1: "rotten_meat", chance: 0.005 },
      vinegar: { elem1: "rotten_meat", chance: 0.001 }
    }
  },
  "frozen_frog": {
    color: "#007349",
    behavior: behaveSturdyPowder,
    category: "life",
    state: "solid",
    density: 1500,
    temp: -20,
    tempHigh: 5,
    stateHigh: "frog",
    hidden: true,
    breakInto: "slime"
  },
  "tadpole": {
    color: "#87b574",
    behavior: [
          "XX|XX|M2%25 AND SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water%14",
          "XX|FX%0.5|SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water%14",
          "XX|M1|SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water%14"
        ],
    category: "life",
    state: "solid",
    density: 1450,
    tempHigh: 100,
    tempLow: -10,
    stateHigh: "steam",
    stateLow: "ice",
    hidden: true,
    conduct: 0.2,
    breakInto: [
          "slime",
          null
        ],
    reactions: {
      algae: { chance: 0.25 },
      kelp: { elem2: "water", chance: 0.25 }
    }
  },
  "fish": {
    color: "#ac8650",
    behavior: [
          "XX|M2%5|SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water,primordial_soup%14",
          "XX|FX%0.5|BO",
          "M2|M1|M2 AND SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water,primordial_soup%5"
        ],
    category: "life",
    state: "solid",
    density: 1080,
    temp: 20,
    tempHigh: 120,
    tempLow: -20,
    stateHigh: "cooked_meat",
    stateLow: [
          "frozen_meat",
          "frozen_meat",
          "frozen_meat",
          "frozen_fish"
        ],
    conduct: 0.2,
    burn: 20,
    burnTime: 200,
    breakInto: "blood",
    foodNeed: 20,
    eggColor: [
          "#211316",
          "#2C1A1D",
          "#503734"
        ],
    stateHighColor: "#E4CFB9",
    reactions: {
      algae: { chance: 0.25, func: null },
      kelp: { elem2: "water", chance: 0.25 },
      plant: { chance: 0.125, func: null },
      fly: { chance: 0.4, func: null },
      firefly: { chance: 0.6, func: null },
      worm: { chance: 0.25, func: null },
      tadpole: { chance: 0.25, func: null },
      spider: { chance: 0.25, func: null },
      oxygen: { elem2: "carbon_dioxide", chance: 0.5 },
      dead_bug: { chance: 0.2, func: null },
      broth: { elem2: "water", chance: 0.2, func: null },
      slug: { chance: 0.2, func: null },
      herb: { chance: 0.15, func: null },
      lettuce: { chance: 0.15, func: null },
      dead_plant: { chance: 0.15, func: null },
      lichen: { chance: 0.1, func: null },
      yeast: { chance: 0.15, func: null },
      yogurt: { chance: 0.15, func: null },
      tea: { chance: 0.2, func: null },
      yolk: { chance: 0.15, func: null },
      cell: { chance: 0.15, func: null },
      crumb: { chance: 0.1, func: null },
      alcohol: { elem1: "meat", chance: 0.001 },
      water: { elem2: "bubble", attr2: {
                clone: "water"
              }, chance: 0.001, oneway: true },
      salt_water: { elem2: "bubble", attr2: {
                clone: "salt_water"
              }, chance: 0.001, oneway: true },
      pool_water: { elem1: "meat", chance: 0.001 },
      chlorine: { elem1: "meat", chance: 0.1 },
      vinegar: { elem1: "meat", chance: 0.001 }
    }
  },
  "frozen_fish": {
    color: "#50ac86",
    behavior: behaveSturdyPowder,
    category: "life",
    state: "solid",
    density: 1050,
    temp: -20,
    tempHigh: 5,
    stateHigh: "fish",
    hidden: true,
    conduct: 0.17,
    breakInto: "blood"
  },
  "slug": {
    color: [
          "#997e12",
          "#997e12",
          "#997e12",
          "#997e12",
          "#997e12",
          "#997e12",
          "#403314",
          "#403314",
          "#403314",
          "#403314",
          "#403314",
          "#403314",
          "#124a44"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|FX%0.25|M2%0.5 AND BO",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1450,
    tempHigh: 90,
    tempLow: 5,
    stateHigh: "slime",
    stateLow: "slime",
    conduct: 0.17,
    breakInto: "slime",
    buttonColor: [
          "#997e12",
          "#403314"
        ],
    reactions: {
      salt: { elem1: "slime" },
      potassium_salt: { elem1: "slime" },
      epsom_salt: { elem1: "slime" },
      coffee_bean: { chance: 0.05 },
      coffee_ground: { chance: 0.05 },
      coffee: { chance: 0.05 },
      soap: { chance: 0.05 },
      plant: { chance: 0.05, func: null },
      evergreen: { chance: 0.05, func: null },
      cactus: { chance: 0.05, func: null },
      dead_plant: { chance: 0.05, func: null },
      worm: { chance: 0.01, func: null },
      mushroom_spore: { chance: 0.05, func: null },
      grass: { chance: 0.05, func: null },
      herb: { chance: 0.05, func: null },
      lettuce: { chance: 0.05, func: null },
      grass_seed: { chance: 0.05, func: null },
      algae: { chance: 0.05, func: null },
      kelp: { elem2: "water", chance: 0.05, func: null },
      coral: { elem2: "water", chance: 0.01, func: null },
      mushroom_cap: { chance: 0.05, func: null },
      mushroom_stalk: { chance: 0.05, func: null },
      mushroom_gill: { chance: 0.05, func: null },
      lichen: { chance: 0.05, func: null },
      hyphae: { elem2: "dirt", chance: 0.05, func: null },
      mycelium: { elem2: "dirt", chance: 0.05, func: null },
      pumpkin: { chance: 0.01, func: null },
      grape: { chance: 0.01, func: null }
    }
  },
  "snail": {
    color: "#5c3104",
    behavior: [
          "XX|XX|XX",
          "XX|FX%0.25|M2%0.5 AND BO",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1500,
    tempHigh: 100,
    tempLow: -6.4,
    stateHigh: "limestone",
    stateLow: "limestone",
    conduct: 0.16,
    breakInto: [
          "slime",
          "limestone"
        ],
    reactions: {
      salt: { elem1: "limestone" },
      dirty_water: { elem2: "water", chance: 0.05, func: null },
      broth: { elem2: "water", chance: 0.05, func: null },
      tea: { elem2: "water", chance: 0.05, func: null },
      potassium_salt: { elem1: "limestone" },
      epsom_salt: { elem1: "limestone" },
      coffee_bean: { elem1: "limestone", chance: 0.05 },
      coffee_ground: { elem1: "limestone", chance: 0.05 },
      coffee: { elem1: "limestone", chance: 0.05 },
      soap: { elem1: "limestone", chance: 0.05 },
      plant: { chance: 0.05, func: null },
      evergreen: { chance: 0.05, func: null },
      cactus: { chance: 0.05, func: null },
      dead_plant: { chance: 0.05, func: null },
      worm: { chance: 0.01, func: null },
      mushroom_spore: { chance: 0.05, func: null },
      grass: { chance: 0.05, func: null },
      herb: { chance: 0.05, func: null },
      lettuce: { chance: 0.05, func: null },
      grass_seed: { chance: 0.05, func: null },
      algae: { chance: 0.05, func: null },
      kelp: { elem2: "water", chance: 0.05, func: null },
      coral: { elem2: "water", chance: 0.01, func: null },
      mushroom_cap: { chance: 0.05, func: null },
      mushroom_stalk: { chance: 0.05, func: null },
      mushroom_gill: { chance: 0.05, func: null },
      lichen: { chance: 0.05, func: null },
      hyphae: { elem2: "dirt", chance: 0.05, func: null },
      mycelium: { elem2: "dirt", chance: 0.05, func: null },
      pumpkin: { chance: 0.01, func: null },
      calcium: { chance: 0.01, func: null },
      limestone: { chance: 0.001, func: null },
      quicklime: { chance: 0.01, func: null },
      slaked_lime: { chance: 0.01, func: null },
      paper: { chance: 0.01, func: null },
      pickle: { chance: 0.05, func: null },
      grape: { chance: 0.01, func: null }
    }
  },
  // -------------------- MACHINES --------------------

  "burner": {
    color: "#d6baa9",
    behavior: [
          "CR:propane|CR:propane|CR:propane",
          "XX|XX|XX",
          "XX|XX|XX"
        ],
    category: "machines",
    conduct: 0.73
  },
  "pipe": {
    color: "#414c4f",
    category: "machines",
    hardness: 0.75,
    insulate: true,
    movable: false,
    forceSaveColor: true,
    canContain: true
  },
  "pipe_wall": {
    color: "#586879",
    behavior: behaveWall,
    category: "machines",
    hidden: true,
    insulate: true,
    noMix: true
  },
  "filter": {
    color: [
          "#885a3a",
          "#64432b"
        ],
    category: "machines",
    hardness: 0.75,
    movable: false,
    forceSaveColor: true,
    colorKey: {
          L: "#885a3a",
          D: "#64432b"
        },
    colorPattern: [
          "DL",
          "LD"
        ],
    canContain: true
  },
  "gate": {
    color: [
          "#883a88",
          "#642b64"
        ],
    category: "machines",
    conduct: 1,
    hardness: 0.75,
    insulate: true,
    movable: false,
    forceSaveColor: true,
    colorKey: {
          L: "#883a88",
          D: "#642b64"
        },
    colorPattern: [
          "DD",
          "LL"
        ],
    canContain: true,
    onlyConduct: [
          "gate",
          "wire"
        ]
  },
  "mixer": {
    color: [
          "#9f936f",
          "#b4a98e",
          "#c8beac"
        ],
    behavior: [
          "MX|MX|MX",
          "MX|CC:#9f936f,#b4a98e,#c8beac|MX",
          "MX|MX|MX"
        ],
    category: "machines",
    darkText: true,
    noMix: true,
    outline: false
  },
  "grinder": {
    color: [
          "#8a8986",
          "#a3a29f",
          "#bcbbb9"
        ],
    behavior: [
          "MX|SM%8 AND MX|MX",
          "SM%8 AND MX|CC:#8a8986,#a3a29f,#bcbbb9|SM%8 AND MX",
          "MX|SM%8 AND MX|MX"
        ],
    category: "machines",
    darkText: true,
    noMix: true,
    outline: false
  },
  "fuse": {
    color: "#825d38",
    category: "machines",
    state: "solid",
    density: 1000,
    tempHigh: 500,
    stateHigh: "fire",
    conduct: 1,
    burn: 100,
    burnTime: 1,
    burnInto: "flash",
    fireElement: "flash",
    movable: true,
    ignoreConduct: [
          "ecloner",
          "sensor"
        ]
  },
  "ewall": {
    color: "#7a7769",
    behavior: behaveWall,
    category: "machines",
    conduct: 1,
    hardness: 1,
    noMix: true,
    name: "e-wall"
  },
  // -------------------- SPECIAL --------------------

  "udder": {
    color: "#ecb3f5",
    category: "special",
    tempHigh: 100,
    tempLow: -18,
    stateHigh: "cooked_meat",
    stateLow: "frozen_meat",
    burn: 15,
    burnTime: 200,
    burnInto: "cooked_meat",
    movable: false,
    reactions: {
      soda: { attr1: {
                clone: "pilk"
              }, chance: 0.1 },
      juice: { attr1: {
                clone: "fruit_milk"
              }, chance: 0.1 },
      melted_chocolate: { attr1: {
                clone: "chocolate_milk"
              }, chance: 0.1 },
      yolk: { attr1: {
                clone: "eggnog"
              }, chance: 0.1 },
      chocolate: { attr1: {
                clone: "chocolate_milk"
              }, chance: 0.1 }
    }
  },
  // -------------------- LIFE --------------------

  "bone_marrow": {
    color: "#c97265",
    behavior: [
          "XX|CR:blood,bone,bone%1|XX",
          "CR:blood,bone,bone%1|XX|CR:blood,bone,bone%1",
          "XX|CR:blood,bone,bone%1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1000,
    tempHigh: 750,
    tempLow: -10,
    stateHigh: [
          "quicklime",
          "salt",
          "steam",
          "ash"
        ],
    stateLow: "frozen_meat",
    hidden: true,
    breakInto: [
          "quicklime",
          "blood"
        ]
  },
  "bone": {
    color: "#d9d9d9",
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "life",
    state: "solid",
    density: 1900,
    tempHigh: 760,
    stateHigh: "quicklime",
    breakInto: [
          "quicklime",
          "quicklime",
          "quicklime",
          "bone_marrow"
        ],
    hardness: 0.5,
    reactions: {
      blood: { elem1: "bone_marrow", chance: 0.0005 },
      antibody: { elem1: "bone_marrow", chance: 0.0005 },
      water: { elem2: "broth", tempMin: 70 },
      salt_water: { elem2: "broth", tempMin: 70 },
      sugar_water: { elem2: "broth", tempMin: 70 },
      seltzer: { elem2: "broth", tempMin: 70 }
    }
  },
  // -------------------- SPECIAL --------------------

  "antipowder": {
    color: "#ebd1d8",
    behavior: [
      ["M2", "M1", "M2"],
      ["XX", "XX", "XX"],
      ["XX", "XX", "XX"]
    ],
    category: "special",
    state: "solid",
    density: 1850,
    tempHigh: 1850,
    stateHigh: "antimolten"
  },
  "antimolten": {
    color: [
          "#ffb5b5",
          "#ffd0b5",
          "#ffd0b5"
        ],
    behavior: [
          "M1|M1|M1",
          "M2|XX|M2",
          "XX|CR:antifire%2.5|XX"
        ],
    category: "special",
    state: "liquid",
    density: 1000,
    temp: 1850,
    tempLow: 1750,
    stateLow: "antipowder",
    hidden: true,
    viscosity: 10000
  },
  "antifire": {
    color: [
          "#ffc3a6",
          "#ffdfa3",
          "#ffb69e"
        ],
    behavior: [
          "XX|M2|XX",
          "M2|XX|M2",
          "M1|M1|M1"
        ],
    category: "special",
    state: "gas",
    density: 0.2,
    temp: 600,
    tempHigh: 7000,
    tempLow: 100,
    stateHigh: "plasma",
    stateLow: "antigas",
    hidden: true,
    burnTime: 25,
    burnInto: "antigas",
    burning: true,
    fireElement: "flash",
    ignoreAir: true,
    reactions: {
      antifluid: { elem1: "antigas" },
      water: { elem1: "antigas" },
      steam: { elem1: "antigas" }
    }
  },
  "antifluid": {
    color: "#d1dbeb",
    behavior: [
      ["M1", "M1", "M1"],
      ["M2", "XX", "M2"],
      ["XX", "XX", "XX"]
    ],
    category: "special",
    state: "liquid",
    density: 1000,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "antigas",
    stateLowName: "antiice"
  },
  "antigas": {
    color: "#e6fffc",
    behavior: [
          "M2|M2|M2",
          "M2|XX|M2",
          "M1|M1|M1"
        ],
    category: "special",
    state: "gas",
    density: 10,
    temp: 150,
    tempHigh: 1000,
    tempLow: 100,
    stateHigh: "antifire",
    stateLow: "antifluid",
    hidden: true
  },
  "vertical": {
    color: "#d9d9d9",
    behavior: [
          "XX|M1 AND BO|XX",
          "CR:wall|XX|CR:wall",
          "XX|XX|XX"
        ],
    category: "special",
    hidden: true,
    excludeRandom: true,
    reactions: {
      electric: { elem1: "horizontal" }
    }
  },
  "horizontal": {
    color: "#d9d9d9",
    behavior: [
          "XX|CR:wall|XX",
          "XX|XX|M1 AND BO",
          "XX|CR:wall|XX"
        ],
    category: "special",
    hidden: true,
    excludeRandom: true,
    reactions: {
      proton: { elem1: "vertical" },
      positron: { elem1: "vertical" }
    }
  },
  // -------------------- POWDERS --------------------

  "ash": {
    color: [
          "#8c8c8c",
          "#9c9c9c"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 700,
    tempHigh: 2000,
    stateHigh: [
          "molten_ash",
          "smoke",
          "smoke",
          "smoke"
        ],
    forceAutoGen: true,
    reactions: {
      steam: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      rain_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      snow_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      hail_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      thunder_cloud: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      acid_cloud: { elem1: "pyrocumulus", chance: 0.05, y: [
                0,
                12
              ], setting: "clouds" },
      pyrocumulus: { elem1: "pyrocumulus", chance: 0.08, y: [
                0,
                12
              ], setting: "clouds" },
      tornado: { elem1: "pyrocumulus", oneway: true },
      stench: { chance: 0.1 },
      molten_dirt: { elem2: "molten_tuff" }
    }
  },
  "molten_ash": {
    tempHigh: 3550,
    stateHigh: "smoke"
  },
  // -------------------- ENERGY --------------------

  "light": {
    color: "#fffdcf",
    category: "energy",
    state: "gas",
    density: 0.00001,
    temp: 35,
    tempLow: -273,
    stateLow: [
          "liquid_light",
          null
        ],
    insulate: true,
    ignoreAir: true,
    alias: "photon",
    stateLowColorMultiplier: 0.8,
    reactions: {
      glass: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      glass_shard: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      rad_glass: { color1: [
                "#9f6060",
                "#9f8260",
                "#9f9f60",
                "#609f60",
                "#609f9f",
                "#60609f",
                "#9f609f"
              ] },
      rad_shard: { color1: [
                "#9f6060",
                "#9f8260",
                "#9f9f60",
                "#609f60",
                "#609f9f",
                "#60609f",
                "#9f609f"
              ] },
      steam: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      rain_cloud: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      cloud: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      smog: { color1: [
                "#9f6060",
                "#9f8260",
                "#9f9f60",
                "#609f60",
                "#609f9f",
                "#60609f",
                "#9f609f"
              ] },
      ice: { color1: "#c2fff9" },
      rime: { color1: "#c2fff9" },
      water: { color1: "#a1bac9" },
      salt_water: { color1: "#a1bac9" },
      sugar_water: { color1: "#a1bac9" },
      dirty_water: { color1: "#a1c9a8" },
      seltzer: { color1: "#c2fff9" },
      diamond: { color1: [
                "#c2c5ff",
                "#c2d9ff"
              ] },
      rainbow: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      static: { color1: [
                "#ffffff",
                "#bdbdbd",
                "#808080",
                "#424242",
                "#1c1c1c"
              ] },
      pipe: {},
      pipe_wall: {},
      wall: {}
    }
  },
  "liquid_light": {
    color: "#bdbc9d",
    category: "energy",
    state: "gas",
    density: 0.00002,
    temp: -273,
    tempHigh: -272,
    stateHigh: "light",
    hidden: true,
    viscosity: 0,
    insulate: true,
    ignoreAir: true,
    reactions: {
      glass: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      glass_shard: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      rad_glass: { color1: [
                "#9f6060",
                "#9f8260",
                "#9f9f60",
                "#609f60",
                "#609f9f",
                "#60609f",
                "#9f609f"
              ] },
      rad_shard: { color1: [
                "#9f6060",
                "#9f8260",
                "#9f9f60",
                "#609f60",
                "#609f9f",
                "#60609f",
                "#9f609f"
              ] },
      steam: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      rain_cloud: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      cloud: { color1: [
                "#ff0000",
                "#ff8800",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#0000ff",
                "#ff00ff"
              ] },
      smog: { color1: [
                "#9f6060",
                "#9f8260",
                "#9f9f60",
                "#609f60",
                "#609f9f",
                "#60609f",
                "#9f609f"
              ] },
      laser: { color1: "#ff0000" }
    }
  },
  "laser": {
    color: "#ff0000",
    behavior: [
          "XX|XX|XX",
          "XX|DL%0.25|XX",
          "XX|XX|XX"
        ],
    category: "energy",
    state: "gas",
    density: 0.00001,
    temp: 35,
    tempLow: -273,
    stateLow: [
          "liquid_light",
          null
        ],
    breakInto: "light",
    ignoreAir: true,
    stateLowColorMultiplier: 0.8,
    breakIntoColor: "#ffcfcf"
  },
  // -------------------- SPECIAL --------------------

  "pointer": {
    color: "#ff0000",
    category: "special",
    state: "gas",
    density: 1,
    hidden: true,
    movable: false,
    customColor: true,
    canPlace: true,
    glow: false,
    reactions: {
      molten_stained_glass: { elem1: "rainbow" },
      metal_scrap: { charged: true, elem1: "static" }
    }
  },
  // -------------------- POWDERS --------------------

  "charcoal": {
    color: "#2b2b2b",
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 208,
    tempHigh: 6000,
    stateHigh: "fire",
    conduct: 0.001,
    burn: 25,
    burnTime: 1000,
    burnInto: [
          "fire",
          "fire",
          "fire",
          "fire",
          "ash",
          "carbon_dioxide"
        ],
    breakInto: [
          "ash",
          "ash",
          "carbon_dioxide"
        ],
    hardness: 0.5,
    stain: 0.02,
    reactions: {
      broth: { elem2: "water", chance: 0.02 },
      tea: { elem2: "water", chance: 0.02 },
      poison: { elem2: "dirty_water", chance: 0.02 },
      sulfur: { elem1: "gunpowder", elem2: "gunpowder", chance: 0.02 },
      molten_sulfur: { elem1: "gunpowder", elem2: "gunpowder", chance: 0.02 },
      dead_plant: { elem2: "charcoal", tempMin: 200, chance: 0.005, oneway: true }
    }
  },
  "tinder": {
    color: [
          "#917256",
          "#87684f",
          "#735f4a",
          "#5d4c3e",
          "#4b3a2e"
        ],
    behavior: behaveSturdyPowder,
    category: "powders",
    state: "solid",
    density: 23,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 50,
    burnTime: 100
  },
  "sawdust": {
    color: [
          "#dec150",
          "#c7b15a"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 393,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 25,
    burnTime: 150,
    burnInto: [
          "ash",
          "fire",
          "fire",
          "fire"
        ],
    reactions: {
      water: { elem1: "cellulose" },
      dirty_water: { elem1: "cellulose" },
      salt_water: { elem1: "cellulose" },
      sugar_water: { elem1: "cellulose" },
      honey: { elem1: "particleboard" },
      glue: { elem1: "particleboard" }
    }
  },
  "hail": {
    color: "#c5e9f0",
    category: "powders",
    state: "solid",
    density: 850,
    temp: -20,
    tempHigh: 10,
    stateHigh: "water",
    hidden: true,
    insulate: true
  },
  // -------------------- GASES --------------------

  "hydrogen": {
    color: "#558bcf",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 0.08375,
    tempLow: -253,
    stateLow: "liquid_hydrogen",
    conduct: 0.02,
    burn: 100,
    burnTime: 2,
    burnInto: [
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "steam"
        ],
    fireColor: "#637980",
    colorOn: "#7d15e5",
    reactions: {
      oxygen: { elem2: "steam", tempMin: 500, tempMax: 3000 },
      hydrogen: { elem1: "neutron", elem2: "helium", tempMin: 10000, temp1: 20000, temp2: 20000 },
      nitrogen: { elem2: "oxygen", tempMin: 10000 },
      sulfur: { elem2: "chlorine", tempMin: 10000 },
      neon: { elem2: "sodium", tempMin: 10000 },
      fire: { elem1: "explosion", chance: 0.005 },
      carbon_dioxide: { elem1: [
                "methane",
                null
              ], elem2: "steam", tempMin: 300 },
      charcoal: { elem2: "oil", tempMin: 400, chance: 0.1 }
    }
  },
  "oxygen": {
    color: "#99c7ff",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.292,
    tempLow: -183.94,
    stateLow: "liquid_oxygen",
    reactions: {
      copper: { elem2: "oxidized_copper", chance: 0.05 },
      bronze: { elem2: "oxidized_copper", chance: 0.025 },
      iron: { elem2: "rust", chance: 0.025 },
      steel: { elem2: "rust", chance: 0.02 },
      water: { elem1: "foam", attr1: {
                clone: "oxygen"
              } },
      salt_water: { elem1: "foam", attr1: {
                clone: "oxygen"
              } },
      sugar_water: { elem1: "foam", attr1: {
                clone: "oxygen"
              } },
      seltzer: { elem1: "foam", attr1: {
                clone: "oxygen"
              } },
      soda: { elem1: "foam", attr1: {
                clone: "oxygen"
              } },
      dirty_water: { elem1: "foam", attr1: {
                clone: "oxygen"
              } },
      oxygen: { elem2: "ozone", chance: 0.01, y: [
                0,
                12
              ], setting: "clouds" },
      ozone: { elem1: "ozone", chance: 0.01, y: [
                0,
                12
              ], setting: "clouds" },
      light: { elem1: "ozone", chance: 0.3, y: [
                0,
                12
              ], setting: "clouds" },
      proton: { elem1: "flash", color1: "#e36d88", attr1: {
                delay: 500
              }, elem2: "flash", color2: "#e36d88", attr2: {
                delay: 500
              }, chance: 0.25, y: [
                0,
                10
              ] },
      paper: { elem1: "fragrance", chance: 0.005 },
      molten_lead: { elem2: "poison_gas" }
    }
  },
  "nitrogen": {
    color: "#b8d1d4",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.165,
    tempLow: -195.8,
    stateLow: "liquid_nitrogen",
    reactions: {
      oxygen: { elem2: "anesthesia", tempMin: 250 },
      hydrogen: { elem2: "ammonia" },
      neon: { elem2: "chlorine", tempMin: 10000 },
      proton: { elem1: "flash", color1: "#895adb", attr1: {
                delay: 500
              }, elem2: "flash", color2: "#895adb", attr2: {
                delay: 500
              }, chance: 0.05, y: [
                0,
                20
              ] }
    }
  },
  "helium": {
    color: "#a69494",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 0.1786,
    tempLow: -272.2,
    stateLow: "liquid_helium",
    conduct: 0.02,
    colorOn: "#f1a1ff"
  },
  "anesthesia": {
    color: "#d3e1e3",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.9781,
    tempHigh: 600,
    tempLow: -88.48,
    stateHigh: [
          "oxygen",
          "fire"
        ],
    stateLow: [
          "nitrogen",
          "oxygen"
        ],
    hidden: true,
    alias: [
          "nitrous oxide",
          "anaesthesia",
          "anesthetic"
        ]
  },
  "carbon_dioxide": {
    color: "#2f2f2f",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.977,
    tempLow: -78.5,
    stateLow: "dry_ice",
    alias: [
          "CO2",
          "CO₂"
        ],
    reactions: {
      plant: { elem1: "oxygen" },
      evergreen: { elem1: "oxygen" },
      grass: { elem1: "oxygen" },
      cactus: { elem1: "oxygen" },
      bamboo: { elem1: "oxygen" },
      bamboo_plant: { elem1: "oxygen" },
      vine: { elem1: "oxygen" },
      flower_seed: { elem1: "oxygen" },
      grass_seed: { elem1: "oxygen" },
      algae: { elem1: "oxygen" },
      kelp: { elem1: "oxygen" }
    }
  },
  "bubble": {
    color: "#afc7fa",
    behavior: [
          "XX|XX|XX",
          "XX|FX%1|M1%5",
          "XX|M1%1|M1%2"
        ],
    category: "gases",
    state: "gas",
    density: 1.294,
    tempHigh: 200,
    tempLow: -10,
    stain: -0.1
  },
  "ammonia": {
    color: "#bab6a9",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 0.73,
    tempLow: -33.34,
    stateLow: "liquid_ammonia",
    reactions: {
      methane: { elem1: [
                "hydrogen",
                "water"
              ], elem2: "cyanide_gas", chance: 0.25 },
      vinegar: { elem1: "salt_water", elem2: "salt_water", chance: 0.05 },
      plant: { elem1: "plant", chance: 0.05 },
      evergreen: { elem1: "evergreen", chance: 0.05 },
      cactus: { elem1: "cactus", chance: 0.05 },
      wheat: { elem1: "wheat", chance: 0.05 },
      wheat_seed: { elem1: "wheat", chance: 0.05 },
      grass: { elem1: "grass", chance: 0.05 },
      grass_seed: { elem1: "grass", chance: 0.05 },
      bamboo_plant: { elem1: "bamboo", chance: 0.05 },
      flower_seed: { elem1: "flower_seed", chance: 0.05 },
      petal: { elem1: "flower_seed", chance: 0.05 },
      vine: { elem1: "vine", chance: 0.05 },
      sapling: { elem1: "tree_branch", chance: 0.05 },
      tree_branch: { elem1: "tree_branch", chance: 0.05 },
      corn_seed: { elem1: "corn", chance: 0.05 },
      root: { elem1: "root", chance: 0.05 },
      dirt: { elem1: "grass", chance: 0.05 },
      mud: { elem1: "grass", chance: 0.05 },
      water: { elem1: "algae", chance: 0.005 },
      kelp: { elem1: [
                "kelp",
                "algae"
              ], chance: 0.005 },
      coral: { elem1: "coral", chance: 0.005 },
      potato_seed: { elem1: "potato", chance: 0.05 },
      pumpkin_seed: { elem1: "pumpkin", chance: 0.05 },
      herb: { elem1: "herb", chance: 0.05 },
      lettuce: { elem1: "lettuce", chance: 0.05 },
      yeast: { elem1: "yeast", chance: 0.05 },
      fish: { elem2: "meat", chance: 0.05 },
      bird: { elem2: "meat", chance: 0.05 },
      frog: { elem2: "meat", chance: 0.05 },
      rat: { elem2: "rotten_meat", chance: 0.05 }
    }
  },
  "liquid_ammonia": {
    density: 681.9,
    tempLow: -77.78
  },
  // -------------------- LIQUIDS --------------------

  "oil": {
    color: "#470e00",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 825,
    tempHigh: 500,
    stateHigh: "fire",
    viscosity: 250,
    burn: 5,
    burnTime: 300,
    burnInto: [
          "carbon_dioxide",
          "fire"
        ],
    stain: 0.05,
    alias: "petroleum",
    reactions: {
      dirt: { elem2: "mud" },
      sand: { elem2: "wet_sand" },
      sap: { elem1: "greek_fire", elem2: "greek_fire" },
      water: { burning1: true, elem2: "explosion" },
      steam: { burning1: true, elem2: "explosion" },
      salt_water: { burning1: true, elem2: "explosion" },
      sugar_water: { burning1: true, elem2: "explosion" },
      dirty_water: { burning1: true, elem2: "explosion" },
      pool_water: { burning1: true, elem2: "explosion" },
      seltzer: { burning1: true, elem2: "explosion" },
      coral: { chance: 0.01 },
      hydrogen: { elem1: "sulfur", elem2: "steam", burning1: false, burning2: false, tempMin: 90, chance: 0.1 }
    }
  },
  "lamp_oil": {
    color: "#b3b38b",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 850,
    tempHigh: 2100,
    tempLow: -30,
    stateHigh: "fire",
    stateLow: "wax",
    viscosity: 3,
    burn: 5,
    burnTime: 2000,
    burnInto: [
          "carbon_dioxide",
          "fire"
        ],
    alias: "kerosene",
    reactions: {
      glue: { chance: 0.05 },
      wax: { chance: 0.005 },
      melted_wax: { chance: 0.025 },
      dirt: { elem2: "mud" },
      steam: { burning1: true, elem2: "explosion" }
    }
  },
  // -------------------- GASES --------------------

  "propane": {
    color: "#cfcfcf",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 2.0098,
    tempHigh: 600,
    tempLow: -43,
    stateLow: "liquid_propane",
    stateHigh: "fire",
    conduct: 0.01,
    burn: 100,
    burnTime: 5,
    fireColor: [
          "#00ffff",
          "#00ffdd"
        ],
    behaviorOn: [
          "XX|XX|XX",
          "XX|CH:fire|XX",
          "XX|XX|XX"
        ],
    alias: "gas"
  },
  "liquid_propane": {
    tempHigh: -40,
    tempLow: -188,
    stateHigh: "propane"
  },
  "methane": {
    color: "#9f9f9f",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 0.554,
    tempHigh: 537,
    tempLow: -161.5,
    stateLow: "liquid_methane",
    stateHigh: "fire",
    conduct: 0.01,
    burn: 85,
    burnTime: 5,
    fireColor: [
          "#00ffff",
          "#00ffdd"
        ],
    behaviorOn: [
          "XX|XX|XX",
          "XX|CH:fire|XX",
          "XX|XX|XX"
        ]
  },
  "liquid_methane": {
    tempLow: -182
  },
  // -------------------- SOLIDS --------------------

  "stained_glass": {
    color: [
          "#6b2e2e",
          "#6b4f2e",
          "#6b6b2e",
          "#2e6b2e",
          "#2e6b6b",
          "#2e2e6b",
          "#6b2e6b"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 2500,
    tempHigh: 1500,
    breakInto: "color_sand",
    movable: false,
    noMix: true,
    grain: 0
  },
  "molten_stained_glass": {
    color: [
          "#c27070",
          "#c29c70",
          "#c2c270",
          "#70c270",
          "#70c2c2",
          "#7070c2",
          "#c270c2"
        ]
  },
  // -------------------- SPECIAL --------------------

  "art": {
    color: "#ffffff",
    behavior: behaveWall,
    category: "special",
    customColor: true,
    canPlace: true
  },
  "rainbow": {
    color: [
          "#ff0000",
          "#ff8800",
          "#ffff00",
          "#00ff00",
          "#00ffff",
          "#0000ff",
          "#ff00ff"
        ],
    category: "special",
    breakInto: "static",
    fireColor: [
          "#ff0000",
          "#ff8800",
          "#ffff00",
          "#00ff00",
          "#00ffff",
          "#0000ff",
          "#ff00ff"
        ],
    movable: false,
    darkText: true
  },
  "static": {
    color: [
          "#ffffff",
          "#888888",
          "#000000"
        ],
    category: "special",
    conduct: 1,
    breakInto: "malware",
    fireColor: [
          "#ffffff",
          "#bfbfbf",
          "#888888",
          "#404040",
          "#000000"
        ],
    movable: false,
    outline: false
  },
  "border": {
    color: [
          "#00ffff",
          "#000000",
          "#00ffff",
          "#000000",
          "#00ffff"
        ],
    category: "special",
    hardness: 1,
    insulate: true,
    movable: false,
    outline: false
  },
  // -------------------- LAND --------------------

  "clay": {
    color: "#d4c59c",
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "land",
    state: "solid",
    density: 1760,
    tempHigh: 135,
    tempLow: -50,
    stateHigh: "baked_clay",
    stateLow: "clay_soil",
    reactions: {
      dirt: { elem1: "clay_soil", elem2: "clay_soil" },
      gravel: { elem1: "clay_soil", elem2: "clay_soil" },
      brick_rubble: { elem1: "clay_soil", elem2: "clay_soil" },
      quicklime: { elem1: "cement", elem2: "cement" }
    }
  },
  "clay_soil": {
    color: [
          "#f49a6f",
          "#ab7160",
          "#b56c52"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2%25|M1|M2%25"
        ],
    category: "land",
    state: "solid",
    density: 1600,
    tempHigh: 140,
    stateHigh: "brick",
    reactions: {
      water: { elem1: "clay" },
      salt_water: { elem1: "clay" },
      sugar_water: { elem1: "clay" },
      seltzer: { elem1: "clay" },
      dirty_water: { elem1: "clay" },
      pool_water: { elem1: "clay" },
      slush: { elem1: "clay" },
      soda: { elem1: "clay" },
      juice: { elem1: "clay" },
      milk: { elem1: "clay" },
      chocolate_milk: { elem1: "clay" },
      fruit_milk: { elem1: "clay" },
      pilk: { elem1: "clay" },
      eggnog: { elem1: "clay" },
      nut_milk: { elem1: "clay" },
      cream: { elem1: "clay" },
      vinegar: { elem1: "clay" },
      blood: { elem1: "clay" },
      vaccine: { elem1: "clay" },
      antibody: { elem1: "clay" },
      infection: { elem1: "clay" },
      poison: { elem1: "clay" },
      antidote: { elem1: "clay" }
    }
  },
  // -------------------- SOLIDS --------------------

  "brick": {
    color: "#cb4141",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1650,
    tempHigh: 1540,
    breakInto: "brick_rubble",
    hardness: 0.33,
    buttonColor: [
          "#e05555",
          "#cb4141",
          "#a62e2e"
        ],
    colorKey: {
          l: "#e05555",
          r: "#cb4141",
          d: "#a62e2e",
          w: "#bababa"
        }
  },
  "ruins": {
    color: "#5c5c5c",
    behavior: [
          "XX|SP|XX",
          "XX|XX|XX",
          "M2%1|M1|M2%1"
        ],
    category: "solids",
    state: "solid",
    density: 2400,
    tempHigh: 1500,
    stateHigh: "magma",
    breakInto: "dust",
    hardness: 0.33,
    movable: false,
    buttonColor: [
          "#5c5c5c",
          "#474747",
          "#383838"
        ],
    reactions: {
      fire: { elem1: "gravel", chance: 0.005 },
      smoke: { elem1: "gravel", chance: 0.002 },
      smog: { elem1: "gravel", chance: 0.008 },
      dirty_water: { elem1: "dust", color1: [
                "#424242",
                "#4a4a4a",
                "#787878"
              ], chance: 0.001 },
      body: { elem1: "dust", color1: [
                "#424242",
                "#4a4a4a",
                "#787878"
              ], chance: 0.001 }
    },
    colorKey: {
          l: "#5c5c5c",
          r: "#474747",
          d: "#383838",
          w: "#212121"
        },
    breakIntoColor: [
          "#424242",
          "#4a4a4a",
          "#787878"
        ]
  },
  "adobe": {
    color: "#8a6249",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1946,
    tempHigh: 1200,
    stateHigh: "molten_dirt",
    breakInto: [
          "dirt",
          "dirt",
          "dirt",
          "dirt",
          "dirt",
          "flour"
        ],
    hardness: 0.33,
    buttonColor: [
          "#986c51",
          "#8a6249",
          "#7f5943"
        ],
    alias: "mud brick",
    colorKey: {
          l: "#986c51",
          r: "#8a6249",
          d: "#7f5943",
          w: "#634933"
        }
  },
  // -------------------- LIFE --------------------

  "sapling": {
    color: "#3e9c3e",
    behavior: behaveSeedrise,
    category: "life",
    state: "solid",
    density: 1500,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 65,
    burnTime: 15,
    cooldown: 30,
    properties: {
          age: 0
        },
    seed: true
  },
  "pinecone": {
    color: [
          "#5c3e33",
          "#472f27",
          "#31211b"
        ],
    behavior: behaveSeedrise,
    category: "life",
    state: "solid",
    density: 1500,
    tempHigh: 500,
    stateHigh: "wood",
    burn: 5,
    burnTime: 100,
    cooldown: 30,
    seed: true
  },
  "evergreen": {
    color: "#006300",
    category: "life",
    state: "solid",
    density: 1050,
    tempHigh: 100,
    stateHigh: "dead_plant",
    hidden: true,
    burn: 45,
    burnTime: 75,
    burnInto: [
          "dead_plant",
          "dead_plant",
          "dead_plant",
          "dead_plant",
          "pinecone"
        ],
    breakInto: [
          "dead_plant",
          "dead_plant",
          "dead_plant",
          "dirt",
          "sap"
        ],
    movable: false,
    reactions: {
      vinegar: { elem1: "dead_plant", chance: 0.035 },
      baking_soda: { elem1: "dead_plant", chance: 0.01 },
      bleach: { elem1: "dead_plant", chance: 0.05 },
      alcohol: { elem1: "dead_plant", chance: 0.035 }
    },
    seed: "pinecone"
  },
  "cactus": {
    color: [
          "#78a33e",
          "#84b543",
          "#cce37b",
          "#84b543",
          "#78a33e"
        ],
    category: "life",
    state: "solid",
    density: 600,
    tempHigh: 250,
    tempLow: -5,
    stateHigh: [
          "dead_plant",
          "dead_plant",
          "dead_plant",
          "dead_plant",
          "dead_plant",
          "steam"
        ],
    stateLow: "frozen_plant",
    burn: 10,
    burnTime: 300,
    breakInto: [
          null,
          null,
          null,
          "sap"
        ],
    cooldown: 30,
    reactions: {
      water: { chance: 0.01 },
      vinegar: { elem1: "dead_plant", chance: 0.035 },
      baking_soda: { elem1: "dead_plant", chance: 0.01 },
      bleach: { elem1: "dead_plant", chance: 0.05 },
      alcohol: { elem1: "dead_plant", chance: 0.035 }
    },
    seed: true,
    breakIntoColor: "#D7E1D9"
  },
  "kelp": {
    color: [
          "#b2b51b",
          "#849c00",
          "#648200"
        ],
    category: "life",
    state: "solid",
    density: 1500,
    tempHigh: 80,
    tempLow: 0,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 1,
    burnTime: 100,
    breakInto: "dead_plant",
    cooldown: 30,
    stateHighColor: "#232F17",
    seed: "kelp",
    breakIntoColor: "#232F17"
  },
  "coral": {
    color: [
          "#ff7d7d",
          "#ff9e80",
          "#ffe880",
          "#80ff8d",
          "#bf80ff",
          "#ff80ec"
        ],
    category: "life",
    state: "solid",
    density: 1500,
    tempHigh: 825,
    tempLow: 0,
    stateHigh: "quicklime",
    stateLow: "limestone",
    breakInto: "sand",
    hardness: 0.25,
    darkText: true,
    cooldown: 30,
    forceSaveColor: true,
    reactions: {
      oxygen: { elem2: "carbon_dioxide", chance: 0.5 }
    },
    seed: "coral",
    grain: 5
  },
  "seeds": {
    color: [
          "#359100",
          "#74b332",
          "#b9d461",
          "#dede7a"
        ],
    behavior: behaveSeedrise,
    category: "life",
    cooldown: 30,
    seed: true
  },
  "grass_seed": {
    color: [
          "#439809",
          "#258b08",
          "#118511",
          "#127b12",
          "#136d14"
        ],
    behavior: [
          "XX|M2%0.05|XX",
          "XX|L2:grass|XX",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1400,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 50,
    burnTime: 20,
    cooldown: 30,
    seed: true
  },
  "wheat_seed": {
    color: "#b6c981",
    behavior: [
          "XX|M2%0.25|XX",
          "XX|L2:wheat AND C2:wheat%30|XX",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 769,
    tempHigh: 400,
    tempLow: -2,
    stateHigh: "fire",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 50,
    burnTime: 20,
    cooldown: 30,
    seed: true
  },
  // -------------------- SOLIDS --------------------

  "straw": {
    color: [
          "#e9d391",
          "#a3835e",
          "#b79a73"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 67.5,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 30,
    burnTime: 200,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: "flour"
  },
  "porcelain": {
    color: "#e1e4dd",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 2403,
    breakInto: "porcelain_shard",
    hardness: 0.4,
    noMix: true
  },
  "paper": {
    color: "#f0f0f0",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1201,
    tempHigh: 248,
    stateHigh: [
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "ash"
        ],
    burn: 70,
    burnTime: 300,
    burnInto: [
          "fire",
          "fire",
          "fire",
          "fire",
          "fire",
          "ash"
        ],
    breakInto: "confetti",
    reactions: {
      water: { elem1: "cellulose" },
      dirty_water: { elem1: "cellulose" },
      salt_water: { elem1: "cellulose" },
      sugar_water: { elem1: "cellulose" },
      seltzer: { elem1: "cellulose" },
      soda: { elem1: "cellulose" },
      blood: { elem1: "cellulose" },
      foam: { elem1: "cellulose" },
      bubble: { elem1: "cellulose" },
      oil: { elem1: "cellulose" },
      alcohol: { elem1: "cellulose" },
      vinegar: { elem1: "cellulose" },
      light: { stain1: "#ebdfa7" },
      oxygen: { stain1: "#ebdfa7" }
    },
    breakIntoColor: [
          "#ffffff",
          "#e6e6e6",
          "#dbdbdb"
        ]
  },
  // -------------------- LIFE --------------------

  "pollen": {
    color: "#ffffc0",
    category: "life",
    state: "solid",
    density: 1435,
    tempHigh: 400,
    stateHigh: "ash",
    burn: 50,
    burnTime: 20,
    breakInto: [
          null,
          null,
          "dust"
        ],
    reactions: {
      sugar_water: { elem2: "honey" },
      water: {  },
      salt_water: {  },
      dirty_water: {  },
      seltzer: {  },
      pool_water: {  }
    }
  },
  "flower_seed": {
    color: "#0e990e",
    behavior: [
          "XX|M2%1.5|XX",
          "XX|L2:plant AND C2:pistil%30|XX",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1400,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 50,
    burnTime: 20,
    cooldown: 30,
    seed: true
  },
  "pistil": {
    color: [
          "#8a978f",
          "#d2ac3a",
          "#734e39",
          "#593117",
          "#2f0603"
        ],
    category: "life",
    state: "solid",
    density: 1400,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 50,
    burnTime: 20,
    breakInto: "dead_plant",
    movable: false,
    buttonColor: [
          "#d2ac3a",
          "#2f0603"
        ],
    forceSaveColor: true,
    reactions: {
      alcohol: { chance: 0.1 }
    },
    seed: "flower_seed"
  },
  "petal": {
    color: [
          "#ff0000",
          "#ff8800",
          "#ffff00",
          "#88ff00",
          "#00ff00",
          "#00ff88",
          "#00ffff",
          "#0088ff",
          "#0000ff",
          "#8800ff",
          "#ff00ff"
        ],
    behavior: [
          "XX|ST:pistil|XX",
          "ST:pistil|FX%0.25|ST:pistil",
          "M2%10|ST:pistil AND M1%10|M1%10"
        ],
    category: "life",
    state: "solid",
    density: 1400,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 50,
    burnTime: 20,
    darkText: true,
    forceSaveColor: true,
    reactions: {
      water: { elem2: "tea", tempMin: 80, color2: "#9e4c00" },
      salt_water: { elem2: "tea", tempMin: 80, color2: "#9e4c00" },
      sugar_water: { elem2: "tea", tempMin: 80, color2: "#9e4c00" },
      seltzer: { elem2: "tea", tempMin: 80, color2: "#9e4c00" }
    },
    seed: "flower_seed"
  },
  "tree_branch": {
    color: "#a0522d",
    category: "life",
    state: "solid",
    density: 1500,
    tempHigh: 100,
    tempLow: -30,
    stateHigh: "wood",
    stateLow: "wood",
    hidden: true,
    burn: 2,
    burnTime: 300,
    burnInto: [
          "sap",
          "ember",
          "charcoal",
          "smoke"
        ],
    breakInto: [
          "sap",
          "sawdust"
        ],
    hardness: 0.15,
    movable: false,
    forceSaveColor: true,
    seed: "sapling"
  },
  "vine": {
    color: "#005900",
    category: "life",
    state: "solid",
    density: 1050,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "frozen_plant",
    burn: 35,
    burnTime: 100,
    breakInto: "dead_plant",
    ignore: [
          "vine"
        ],
    seed: "vine"
  },
  "bamboo_plant": {
    color: [
          "#fbc882",
          "#dfad64"
        ],
    behavior: [
          "XX|M2%2|XX",
          "XX|L2:bamboo AND C2:bamboo%10|XX",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 686,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "dead_plant",
    stateLow: "bamboo",
    burn: 30,
    burnTime: 100,
    breakInto: "sawdust",
    cooldown: 30,
    seed: true
  },
  // -------------------- LIQUIDS --------------------

  "foam": {
    color: "#cad2e3",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2%25|M1%25|M2%25"
        ],
    category: "liquids",
    state: "gas",
    density: 40,
    tempLow: -78.5,
    stain: -0.1,
    extinguish: true
  },
  "acid": {
    color: [
          "#AEDF80",
          "#A8EF6F",
          "#a1ff5e",
          "#79DA4D",
          "#50B43B",
          "#288f2a"
        ],
    behavior: [
          "XX|DB%5|XX",
          "DB%5 AND M2|XX|DB%5 AND M2",
          "DB%5 AND M2|DB%10 AND M1|DB%5 AND M2"
        ],
    category: "liquids",
    state: "liquid",
    density: 1049,
    tempHigh: 110,
    tempLow: -58.88,
    stateHigh: "acid_gas",
    burn: 30,
    burnTime: 1,
    ignore: [
          "fire",
          "smoke",
          "glass",
          "rad_glass",
          "glass_shard",
          "rad_shard",
          "stained_glass",
          "baked_clay",
          "acid_gas",
          "neutral_acid",
          "acid_cloud",
          "water",
          "salt_water",
          "sugar_water",
          "dirty_water",
          "copper",
          "gold",
          "porcelain",
          "plastic",
          "bead",
          "molten_plastic",
          "pool_water",
          "chlorine",
          "hydrogen",
          "gold_coin",
          "silver",
          "nickel",
          "calcium",
          "bone",
          "earthquake",
          "tornado",
          "tsunami",
          "liquid_light",
          "sensor",
          "clay",
          "pipe",
          "pipe_wall",
          "filter",
          "gate",
          "lye",
          "rose_gold",
          "purple_gold",
          "blue_gold",
          "electrum",
          "mercury",
          "bubble",
          "diamond"
        ],
    stain: -0.1,
    alias: "hydrochloric acid",
    reactions: {
      ash: { elem1: "neutral_acid" },
      limestone: { elem1: "neutral_acid", elem2: [
                "calcium",
                "carbon_dioxide"
              ] },
      quicklime: { elem1: "neutral_acid" },
      slaked_lime: { elem1: "neutral_acid" },
      borax: { elem1: "neutral_acid" },
      ammonia: { elem1: "neutral_acid" },
      cement: { elem1: "neutral_acid" },
      potassium: { elem1: [
                "fire",
                "hydrogen",
                "pop",
                "explosion"
              ], elem2: "potassium_salt" },
      molten_potassium: { elem1: [
                "fire",
                "hydrogen",
                "pop",
                "explosion"
              ], elem2: "potassium_salt" },
      caustic_potash: { elem1: "water", elem2: "potassium_salt" },
      bone: { elem1: "neutral_acid", chance: 0.01 },
      head: { elem1: "bone", chance: 0.03 },
      body: { elem1: "bone", chance: 0.03 },
      water: { elem2: "dirty_water" },
      salt_water: { elem2: "water" },
      sugar_water: { elem2: "water" },
      plant: { elem2: "dead_plant" },
      tree_branch: { elem2: "wood" },
      charcoal: { elem2: "carbon_dioxide" },
      rock: { elem2: "sand", chance: 0.05 },
      baking_soda: { elem1: "salt_water", elem2: [
                "carbon_dioxide",
                "foam"
              ] },
      calcium: { elem1: "chlorine", elem2: "hydrogen", chance: 0.01 },
      zinc: { elem1: "hydrogen", chance: 0.03 },
      magnesium: { elem1: "hydrogen", temp1: 50, chance: 0.03 },
      sugar: { elem1: "steam", elem2: "carbon_dioxide" },
      gravel: { elem2: "sand", chance: 0.1 },
      wet_sand: { elem1: "neutral_acid", elem2: "clay" },
      snail: { elem1: "neutral_acid", elem2: "slug" },
      silver: { stain2: "#2a2e2a" },
      acid: { elem2: "bubble", color2: "#bfcfa9", attr2: {
                clone: "acid"
              }, chance: 0.001, tempMin: 80 }
    }
  },
  "neutral_acid": {
    color: [
          "#c8d9b0",
          "#c1d9b0",
          "#b8dbb9"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1020,
    tempHigh: 110,
    stateHigh: "hydrogen",
    hidden: true,
    reactions: {
      bone: { elem2: "glue", tempMin: 60, chance: 0.005 }
    }
  },
  // -------------------- GASES --------------------

  "acid_gas": {
    color: [
          "#85a758",
          "#3b7810",
          "#256626"
        ],
    behavior: [
          "M1|DB%5 AND M1|M1",
          "DB%5 AND M1|XX|DB%5 AND M1",
          "DB%5 AND M1|DB%10 AND M1|DB%5 AND M1"
        ],
    category: "gases",
    state: "gas",
    density: 1.29,
    temp: 120,
    tempLow: 30,
    stateLow: "acid",
    burn: 30,
    burnTime: 1,
    ignore: [],
    alias: "hydrochloric acid gas",
    reactions: {
      acid_gas: { elem2: "acid_cloud", chance: 0.3, y: [
                0,
                12
              ], setting: "clouds" },
      rain_cloud: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      cloud: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      snow_cloud: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      hail_cloud: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      thunder_cloud: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      pyrocumulus: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      fire_cloud: { elem2: "acid_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      ash: { elem1: "hydrogen", chance: 0.05 },
      limestone: { elem1: "hydrogen", chance: 0.05 },
      quicklime: { elem1: "hydrogen", chance: 0.05 },
      slaked_lime: { elem1: "hydrogen", chance: 0.05 },
      borax: { elem1: "hydrogen", chance: 0.05 },
      ammonia: { elem1: "hydrogen", chance: 0.05 },
      bleach: { elem1: "hydrogen", chance: 0.05 }
    }
  },
  // -------------------- LIQUIDS --------------------

  "glue": {
    color: "#f0f0f0",
    behavior: [
      ["XX", "ST", "XX"],
      ["ST", "XX", "ST"],
      ["XX", "ST AND M1", "XX"]
    ],
    category: "liquids",
    state: "liquid",
    density: 1300,
    tempHigh: 475,
    stateHigh: [
          "cyanide_gas",
          "dioxin"
        ],
    ignore: [
          "sawdust",
          "particleboard",
          "ice",
          "rime",
          "dry_ice",
          "oxygen_ice",
          "hydrogen_ice",
          "nitrogen_ice"
        ],
    reactions: {
      clay_shard: { elem2: "baked_clay" },
      porcelain_shard: { elem2: "porcelain" },
      glass_shard: { elem2: "glass" },
      ruins: { elem2: "rock_wall" },
      rad_shard: { elem2: "rad_glass" },
      color_sand: { elem2: "stained_glass" },
      confetti: { elem2: "paper" },
      gold_coin: { elem2: "gold" },
      cellulose: { elem2: "paper" },
      feather: { elem2: "cloth" },
      rock: { elem2: "rock_wall" },
      brick_rubble: { elem2: "brick" },
      bead: { elem2: "plastic" },
      dirt: { elem2: "mudstone" },
      sand: { elem2: "packed_sand" },
      crumb: { elem2: "bread" },
      fly: { elem2: "dead_bug" },
      firefly: { elem2: "dead_bug" },
      ant: { elem2: "dead_bug" },
      rat: { elem2: "rotten_meat", chance: 0.05 }
    }
  },
  "soda": {
    color: "#422016",
    behavior: [
          "XX|XX|XX",
          "M2|XX|M2",
          "M2|M1|M2"
        ],
    category: "liquids",
    state: "liquid",
    density: 1030,
    tempHigh: 100,
    tempLow: -1.11,
    stateHigh: [
          "steam",
          "carbon_dioxide",
          "sugar"
        ],
    alias: "cola",
    reactions: {
      rock: { elem2: "wet_sand", chance: 0.0004 },
      water: { elem1: "sugar_water", elem2: "sugar_water" },
      salt: { elem2: "foam", chance: 0.05, color2: "#dbb586" },
      salt_water: { elem2: "foam", chance: 0.01, color2: "#dbb586" },
      sugar: { elem2: "foam", chance: 0.001, color2: "#dbb586" },
      egg: { elem2: "yolk", chance: 0.001 },
      candy: { elem2: "foam", chance: 0.01, color2: "#dbb586" },
      caramel: { elem2: "foam", chance: 0.01, color2: "#dbb586" },
      rust: { elem2: "iron", chance: 0.01 },
      oxidized_copper: { elem2: "copper", chance: 0.01 }
    },
    isFood: true
  },
  // -------------------- SPECIAL --------------------

  "gray_goo": {
    color: "#c0c0c0",
    behavior: [
          "XX|CH:gray_goo%25|XX",
          "M2%5 AND CH:gray_goo%25|DL%5|M2%5 AND CH:gray_goo%25",
          "XX|CH:gray_goo%25 AND M1|XX"
        ],
    category: "special",
    state: "solid",
    density: 21450,
    tempHigh: 1456,
    stateHigh: "molten_steel",
    conduct: 0.25,
    ignore: [
          "fire",
          "smoke",
          "malware",
          "flash",
          "light",
          "laser"
        ],
    behaviorOn: [
          "XX|XX|XX",
          "XX|DL%10|XX",
          "M1|M2|M1"
        ],
    darkText: true,
    excludeRandom: true,
    reactions: {
      antibody: { elem1: "malware" }
    }
  },
  "malware": {
    color: [
          "#8c4ac7",
          "#a13d6a"
        ],
    behavior: [
          "CL%1|CL%1 AND SH|CL%1",
          "CL%1 AND SH|SH%5 AND DL%10|CL%1 AND SH",
          "M1%15 AND CL%1|M1%50 AND CL%2 AND SH|M1%15 AND CL%1"
        ],
    category: "special",
    state: "solid",
    density: 2.1,
    reactions: {
      gray_goo: { elem2: "malware" },
      fireball: { elem2: "rocket" },
      wire: { chance: 0.01 },
      cloner: { elem2: [
                "ecloner",
                "slow_cloner"
              ], chance: 0.01 },
      ecloner: { elem2: [
                "cloner",
                "slow_cloner"
              ], chance: 0.01 },
      slow_cloner: { elem2: [
                "cloner",
                "ecloner"
              ], chance: 0.01 },
      loopy: {  },
      snake: { elem2: "loopy", chance: 0.25 },
      pipe: {  },
      pipe_wall: { elem2: "rock", chance: 0.01 },
      lattice: { elem1: "lattice" },
      light_bulb: { elem2: "explosion", chance: 0.01 },
      battery: { elem2: "explosion", chance: 0.01 },
      heater: { elem2: "cooler", chance: 0.01 },
      cooler: { elem2: "heater", chance: 0.01 },
      led: { elem2: "explosion", chance: 0.01 },
      ewall: { elem2: "wall", chance: 0.01 },
      border: { chance: 0.01 },
      virus: {  },
      lead: { elem2: "pipe", chance: 0.05 },
      tungsten: { elem2: "light_bulb", chance: 0.05 },
      zinc: { elem2: "battery", chance: 0.05 },
      copper: { elem2: "wire", chance: 0.05 }
    }
  },
  // -------------------- MACHINES --------------------

  "ecloner": {
    color: "#dddd00",
    category: "machines",
    conduct: 1,
    hardness: 1,
    insulate: true,
    movable: false,
    ignore: [
          "cloner",
          "slow_cloner",
          "clone_powder",
          "floating_cloner",
          "wire",
          "wall",
          "ewall",
          "sensor",
          "battery",
          "fuse"
        ],
    darkText: true,
    name: "e-cloner",
    ignoreConduct: [
          "fuse"
        ]
  },
  "slow_cloner": {
    color: "#888800",
    category: "machines",
    hardness: 1,
    insulate: true,
    movable: false,
    ignore: [
          "cloner",
          "ecloner",
          "clone_powder",
          "floating_cloner",
          "wall",
          "ewall"
        ],
    onClicked: null
  },
  "clone_powder": {
    color: "#f0f000",
    behavior: behavePowder,
    category: "machines",
    state: "solid",
    density: 2710,
    hidden: true,
    hardness: 1,
    insulate: true,
    ignore: [
          "cloner",
          "ecloner",
          "slow_cloner",
          "floating_cloner",
          "wall",
          "ewall"
        ],
    darkText: true,
    reactions: {
      malware: { elem1: "floating_cloner" }
    },
    onClicked: null
  },
  "floating_cloner": {
    color: "#c7c787",
    behavior: [
          "XX|M1%10|XX",
          "M1%10|XX|M1%10",
          "XX|M1%10|XX"
        ],
    category: "machines",
    state: "solid",
    density: 1355,
    hardness: 1,
    insulate: true,
    ignore: [
          "cloner",
          "ecloner",
          "slow_cloner",
          "clone_powder",
          "wall",
          "ewall"
        ],
    darkText: true,
    reactions: {
      malware: { elem1: "clone_powder" }
    },
    onClicked: null
  },
  // -------------------- SPECIAL --------------------

  "virus": {
    color: "#cc00ff",
    category: "special",
    state: "solid",
    density: 600,
    ignore: [
          "fire",
          "smoke",
          "soap",
          "plague",
          "cancer",
          "plasma",
          "light",
          "loopy",
          "liquid_light",
          "malware",
          "electric",
          "pointer"
        ],
    excludeRandom: true,
    reactions: {
      chlorine: {  },
      liquid_chlorine: {  },
      chlorine_ice: {  },
      light: { chance: 0.1 },
      liquid_light: { chance: 0.1 },
      electric: { elem2: "malware" }
    }
  },
  "ice_nine": {
    color: [
          "#b0dcf7",
          "#bbe9fc",
          "#cefcfc"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|CH:ice%0.5|XX",
          "M2|M1|M2"
        ],
    category: "special",
    state: "solid",
    density: 917,
    temp: -100,
    excludeRandom: true,
    reactions: {
      water: { elem2: "ice_nine" },
      salt_water: { elem2: "ice_nine" },
      dirty_water: { elem2: "ice_nine" },
      sugar_water: { elem2: "ice_nine" },
      seltzer: { elem2: "ice_nine" },
      pool_water: { elem2: "ice_nine" },
      steam: { elem2: "ice_nine" },
      rain_cloud: { elem2: "ice_nine" },
      cloud: { elem2: "ice_nine" },
      snow_cloud: { elem2: "ice_nine" },
      hail_cloud: { elem2: "ice_nine" },
      thunder_cloud: { elem2: "ice_nine" },
      snow: { elem2: "ice_nine" },
      smog: { elem2: "ice_nine" },
      rad_steam: { elem2: "ice_nine" }
    }
  },
  "strange_matter": {
    color: [
          "#a4c730",
          "#b6ff57",
          "#74e846",
          "#2ba31d"
        ],
    category: "special",
    state: "liquid",
    density: 2000,
    ignore: [
          "fire",
          "smoke",
          "antimatter",
          "strange_matter",
          "wall",
          "ewall",
          "plasma",
          "void",
          "border",
          "pointer"
        ],
    excludeRandom: true,
    reactions: {
      void: { elem1: "explosion" }
    }
  },
  // -------------------- LAND --------------------

  "permafrost": {
    color: [
          "#54443a",
          "#4f4235",
          "#453c30",
          "#524639"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "land",
    state: "solid",
    density: 700,
    temp: -50,
    tempHigh: 10,
    stateHigh: "mudstone"
  },
  // -------------------- STATES --------------------

  "melted_butter": {
    color: "#ffe240",
    behavior: behaveLiquid,
    category: "states",
    state: "liquid",
    density: 911,
    temp: 33,
    tempHigh: 1000,
    tempLow: 0,
    stateHigh: [
          "smoke",
          "steam",
          "smoke",
          "steam",
          "smoke",
          "steam",
          "smoke",
          "steam",
          "quicklime",
          "salt"
        ],
    stateLow: "butter",
    hidden: true,
    viscosity: 42,
    stain: 0.05,
    reactions: {
      dirt: { elem2: "mud" },
      sand: { elem2: "wet_sand" },
      toast: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      crumb: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      baked_batter: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      baked_potato: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      caustic_potash: { elem1: "soap", elem2: "soap" }
    },
    isFood: true
  },
  "melted_cheese": {
    color: "#fcdb53",
    behavior: behaveLiquid,
    category: "states",
    state: "liquid",
    density: 400,
    temp: 54,
    tempHigh: 1000,
    tempLow: 0,
    stateHigh: [
          "smoke",
          "steam",
          "alcohol_gas",
          "smoke",
          "steam",
          "alcohol_gas",
          "smoke",
          "steam",
          "alcohol_gas",
          "quicklime",
          "salt"
        ],
    stateLow: "cheese",
    hidden: true,
    viscosity: 30000,
    reactions: {
      salt: { chance: 0.005 }
    },
    isFood: true
  },
  // -------------------- LIFE --------------------

  "mushroom_spore": {
    color: [
          "#d1d1d1",
          "#d4cfa9",
          "#b4d4ae",
          "#b98aba",
          "#805236"
        ],
    behavior: [
          "XX|M2%1.5|XX",
          "XX|L2:mushroom_stalk AND C2:mushroom_gill%20|XX",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 123.6,
    tempHigh: 225,
    stateHigh: "fire",
    burn: 10,
    burnTime: 20,
    darkText: true,
    cooldown: 30,
    reactions: {
      wood: { elem2: "dirt", chance: 0.04 },
      tree_brake: { elem2: "dirt", chance: 0.04 },
      plant: { elem2: "dirt", chance: 0.07 },
      evergreen: { elem2: "dirt", chance: 0.07 },
      root: { elem2: "dirt", chance: 0.07 },
      grass: { elem2: "dirt", chance: 0.08 },
      grass_seed: { elem2: "dirt", chance: 0.08 },
      epsom_salt: { chance: 0.1 }
    },
    seed: true
  },
  "mushroom_stalk": {
    color: "#d1d1d1",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "XX|CH:dirt>hyphae%1 AND M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 90.445,
    tempHigh: 225,
    stateHigh: "fire",
    hidden: true,
    burn: 10,
    burnTime: 65,
    breakInto: [
          null,
          null,
          "mycelium"
        ],
    reactions: {
      wood: { elem2: "dirt", chance: 0.04 },
      tree_brake: { elem2: "dirt", chance: 0.04 },
      plant: { elem2: "dirt", chance: 0.07 },
      evergreen: { elem2: "dirt", chance: 0.07 },
      root: { elem2: "dirt", chance: 0.07 },
      grass: { elem2: "dirt", chance: 0.08 },
      grass_seed: { elem2: "dirt", chance: 0.08 },
      ash: { elem2: "dirt", chance: 0.04 },
      water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      salt_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      sugar_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      seltzer: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] }
    },
    seed: "mushroom_spore"
  },
  "mushroom_gill": {
    color: "#d4cfa9",
    category: "life",
    state: "solid",
    density: 90.445,
    tempHigh: 225,
    stateHigh: "fire",
    hidden: true,
    burn: 10,
    burnTime: 65,
    burnInto: "mushroom_spore",
    breakInto: [
          null,
          "mycelium",
          "mushroom_spore",
          "poison"
        ],
    movable: false,
    reactions: {
      water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      salt_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      sugar_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      seltzer: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] }
    },
    seed: "mushroom_spore"
  },
  "mushroom_cap": {
    color: [
          "#c76243",
          "#c74442",
          "#c7437e",
          "#c043c7",
          "#7c43c7",
          "#4543c7",
          "#4368c7",
          "#43c7c7"
        ],
    behavior: behaveWall,
    category: "life",
    state: "solid",
    density: 90.445,
    tempHigh: 225,
    stateHigh: "fire",
    hidden: true,
    burn: 10,
    burnTime: 65,
    burnInto: "mushroom_spore",
    breakInto: [
          null,
          null,
          "mycelium"
        ],
    singleColor: true,
    reactions: {
      water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      salt_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      sugar_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      seltzer: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] }
    },
    seed: "mushroom_spore"
  },
  "hyphae": {
    color: [
          "#c79789",
          "#bd937b"
        ],
    behavior: [
          "CH:dirt>hyphae,hyphae,mycelium%0.5|CR:mushroom_spore%0.5|CH:dirt>hyphae,hyphae,mycelium%0.5",
          "CH:dirt>mycelium%0.5|XX|CH:dirt>mycelium%0.5",
          "CH:dirt>hyphae,hyphae,mycelium%0.5|XX|CH:dirt>hyphae,hyphae,mycelium%0.5"
        ],
    category: "life",
    state: "solid",
    density: 462,
    tempHigh: 225,
    stateHigh: "fire",
    hidden: true,
    conduct: 0.1,
    burn: 30,
    burnTime: 20,
    breakInto: [
          "dirt",
          "dirt",
          "mycelium"
        ],
    reactions: {
      wood: { elem2: "dirt", chance: 0.04 },
      tree_brake: { elem2: "dirt", chance: 0.04 },
      plant: { elem2: "dirt", chance: 0.07 },
      evergreen: { elem2: "dirt", chance: 0.07 },
      root: { elem2: "dirt", chance: 0.07 },
      grass: { elem2: "dirt", chance: 0.08 },
      grass_seed: { elem2: "dirt", chance: 0.08 },
      ash: { elem2: "dirt", chance: 0.04 },
      water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      salt_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      sugar_water: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] },
      seltzer: { elem2: "broth", tempMin: 70, color2: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ] }
    },
    seed: "mushroom_spore",
    grain: 2
  },
  // -------------------- LAND --------------------

  "mycelium": {
    color: [
          "#734d5e",
          "#734d5e",
          "#734d5e",
          "#61404f",
          "#6b4b5a",
          "#755061",
          "#866372",
          "#987886",
          "#ab8e9a",
          "#bea4ad",
          "#d0b9c1",
          "#e3cfd5"
        ],
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 462,
    tempHigh: 225,
    tempLow: -50,
    stateHigh: "dirt",
    stateLow: "permafrost",
    burn: 20,
    burnTime: 40,
    burnInto: "dirt",
    buttonColor: [
          "#e3cfd5",
          "#734d5e"
        ],
    reactions: {
      dead_plant: { elem2: [
                null,
                null,
                null,
                "mycelium",
                "hyphae"
              ], chance: 0.0025 },
      rotten_meat: { elem2: [
                null,
                null,
                null,
                "mycelium",
                "hyphae"
              ], chance: 0.0025 },
      dead_bug: { elem2: [
                null,
                null,
                null,
                "mycelium",
                "hyphae"
              ], chance: 0.0025 },
      wood: { elem2: [
                null,
                "mycelium",
                "hyphae"
              ], chance: 0.0025 }
    },
    seed: "mushroom_spore"
  },
  "mulch": {
    color: [
          "#94432c",
          "#7a2912",
          "#571a09"
        ],
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 380,
    tempHigh: 400,
    stateHigh: [
          "dirt",
          "dirt",
          "ash",
          "fire"
        ],
    burn: 1,
    burnTime: 200,
    burnInto: [
          "dirt",
          "dirt",
          "ash",
          "fire"
        ]
  },
  "ant_wall": {
    color: [
          "#91643f",
          "#8a593b"
        ],
    behavior: behaveWall,
    category: "land",
    state: "solid",
    density: 1220,
    tempHigh: 1400,
    tempLow: -50,
    stateHigh: [
          "molten_dirt",
          "molten_glass"
        ],
    stateLow: "permafrost",
    hidden: true,
    breakInto: [
          "dirt",
          "sand"
        ],
    reactions: {
      water: { elem1: [
                "mud",
                "mud",
                "wet_sand"
              ], chance: 0.005 },
      dirty_water: { elem1: [
                "mud",
                "mud",
                "wet_sand"
              ], chance: 0.006 },
      salt_water: { elem1: [
                "mud",
                "mud",
                "wet_sand"
              ], chance: 0.007 },
      sugar_water: { elem1: [
                "mud",
                "mud",
                "wet_sand"
              ], chance: 0.003 },
      seltzer: { elem1: [
                "mud",
                "mud",
                "wet_sand"
              ], chance: 0.01 },
      pool_water: { elem1: [
                "mud",
                "mud",
                "wet_sand"
              ], chance: 0.05 },
      fire: { elem1: [
                "dirt",
                "sand"
              ], chance: 0.005 }
    }
  },
  // -------------------- LIFE --------------------

  "lichen": {
    color: [
          "#b6d6c3",
          "#769482"
        ],
    category: "life",
    state: "solid",
    density: 1.5,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 50,
    burnTime: 20,
    breakInto: "dust",
    reactions: {
      carbon_dioxide: { elem2: "oxygen", chance: 0.05 },
      rock: { elem2: "dirt", chance: 0.0025 },
      rock_wall: { elem2: "dirt", chance: 0.0025 },
      gravel: { elem2: "dirt", chance: 0.0025 },
      vinegar: { chance: 0.01 },
      stench: { chance: 0.01 },
      smog: { chance: 0.01 }
    },
    grain: 2
  },
  // -------------------- SPECIAL --------------------

  "antimatter": {
    color: "#a89ba8",
    behavior: [
          "M2|DB%50 AND M2|M2",
          "M1|XX|M1",
          "M1|DB%50 AND M1|M1"
        ],
    category: "special",
    state: "gas",
    density: 2.1,
    ignore: [
          "antimatter_bomb",
          "positron",
          "cloner",
          "slow_cloner",
          "clone_powder",
          "floating_cloner",
          "ecloner"
        ],
    colorOn: "#6156b8",
    excludeRandom: true,
    reactions: {
      proton: { elem1: "explosion", elem2: "explosion" },
      neutron: { elem1: "explosion", elem2: "explosion" },
      electric: { elem1: "explosion", elem2: "explosion" }
    }
  },
  // -------------------- SOLIDS --------------------

  "plastic": {
    color: "#c5dede",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1052,
    tempHigh: 250,
    burn: 10,
    burnTime: 200,
    burnInto: [
          "dioxin",
          "smoke",
          "dioxin",
          "smoke",
          "stench"
        ],
    breakInto: "bead",
    breakIntoColor: [
          "#d3e8e8",
          "#afc9c9"
        ]
  },
  "molten_plastic": {
    color: "#a4b3b3",
    behavior: behaveLiquid,
    tempHigh: 600,
    stateHigh: [
          "dioxin",
          "smoke",
          "dioxin",
          "smoke",
          "stench"
        ],
    viscosity: 20
  },
  "cloth": {
    color: [
          "#F7F7F7",
          "#F1F1F1",
          "#E8E8E8",
          "#CDCDCD"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1314,
    tempHigh: 412,
    stateHigh: "fire",
    burn: 5,
    burnTime: 350,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: "dust",
    movable: false,
    reactions: {
      water: {},
      salt_water: {},
      sugar_water: {},
      dirty_water: {},
      pool_water: {},
      seltzer: {}
    },
    onBreak: null
  },
  // -------------------- LIFE --------------------

  "cellulose": {
    color: "#c7d4c9",
    behavior: behaveLiquid,
    category: "life",
    state: "liquid",
    density: 1500,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "paper",
    stateLow: "paper",
    hidden: true,
    viscosity: 2500,
    burn: 1,
    burnTime: 300,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "steam"
        ],
    alias: "paper paste",
    reactions: {
      herb: { elem1: "incense" }
    }
  },
  // -------------------- POWDERS --------------------

  "wax": {
    color: "#fff3d6",
    behavior: behaveSturdyPowder,
    category: "powders",
    state: "solid",
    density: 900,
    tempHigh: 57,
    stateHigh: "melted_wax"
  },
  // -------------------- LIQUIDS --------------------

  "melted_wax": {
    color: "#d4c196",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 900,
    temp: 67,
    tempHigh: 1000,
    tempLow: 57,
    stateHigh: [
          "smoke",
          "fire",
          "carbon_dioxide",
          "hydrogen"
        ],
    stateLow: "wax",
    hidden: true,
    viscosity: 1.355
  },
  // -------------------- POWDERS --------------------

  "incense": {
    color: "#361f19",
    behavior: behaveSturdyPowder,
    category: "powders",
    state: "solid",
    density: 686,
    tempHigh: 2320,
    stateHigh: [
          "fragrance",
          "smoke"
        ],
    burn: 10,
    burnTime: 500,
    burnInto: [
          "fragrance",
          "smoke"
        ],
    breakInto: "sawdust",
    fireElement: [
          "fragrance",
          "smoke",
          "smoke"
        ]
  },
  // -------------------- GASES --------------------

  "dioxin": {
    color: "#b8b8b8",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.977,
    reactions: {
      cell: { elem2: "cancer", chance: 0.0015 },
      blood: { elem2: "infection", chance: 0.01 },
      antibody: { elem2: "blood", chance: 0.025 },
      frog: { elem2: "meat", chance: 0.05 },
      fish: { elem2: "meat", chance: 0.05 },
      rat: { elem2: "rotten_meat", chance: 0.05 },
      bird: { elem2: "rotten_meat", chance: 0.05 },
      plant: { elem2: "dead_plant", chance: 0.05 },
      vine: { elem2: "dead_plant", chance: 0.05 },
      cactus: { elem2: "dead_plant", chance: 0.05 },
      sapling: { elem2: "dead_plant", chance: 0.05 },
      grass: { elem2: "dead_plant", chance: 0.05 },
      head: { func: null, chance: 0.005 },
      ash: { chance: 0.05 },
      dirt: { chance: 0.05 },
      mud: { chance: 0.05 },
      sand: { chance: 0.05 },
      wet_sand: { chance: 0.05 },
      clay_soil: { chance: 0.05 }
    }
  },
  // -------------------- SOLIDS --------------------

  "insulation": {
    color: "#b8aea5",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 160,
    insulate: true,
    darkText: true,
    noMix: true
  },
  "sponge": {
    color: [
          "#bf9c00",
          "#ad8e05",
          "#876f05"
        ],
    category: "solids",
    state: "solid",
    density: 65,
    tempHigh: 500,
    stateHigh: "fire",
    burn: 5,
    burnTime: 300,
    burnInto: ["ash", "smoke", "smoke", "smoke"],
    movable: false,
    reactions: {
      water: { elem2: null },
      salt_water: { elem2: "salt" },
      sugar_water: { elem2: "sugar" },
      dirty_water: { elem2: "dirt" },
      pool_water: { elem2: "chlorine" },
      seltzer: { elem2: "carbon_dioxide" },
      soap: { elem2: "bubble" },
      mud: { elem2: "dirt" },
      wet_sand: { elem2: "sand" },
      clay: { elem2: "clay_soil" }
    },
    onBreak: null
  },
  "bamboo": {
    color: [
          "#7cc00c",
          "#77a012"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 686,
    tempHigh: 380,
    stateHigh: [
          "ember",
          "fire",
          "fire",
          "fire"
        ],
    burn: 10,
    burnTime: 200,
    burnInto: [
          "ember",
          "fire",
          "fire",
          "fire"
        ],
    breakInto: "sawdust",
    seed: "bamboo_plant"
  },
  "iron": {
    color: [
          "#cbcdcd",
          "#bdbdbd"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 7860,
    tempHigh: 1538,
    conduct: 0.47,
    fireColor: "#d45100",
    hardness: 0.4,
    darkText: true,
    reactions: {
      water: { elem1: "rust", chance: 0.0025 },
      salt_water: { elem1: "rust", chance: 0.005 },
      dirty_water: { elem1: "rust", chance: 0.04 },
      pool_water: { elem1: "rust", chance: 0.04 },
      sugar_water: { elem1: "rust", chance: 0.0035 },
      seltzer: { elem1: "rust", chance: 0.006 },
      salt: { elem1: "rust", chance: 0.004 },
      blood: { elem1: "rust", chance: 0.003 },
      infection: { elem1: "rust", chance: 0.003 },
      antibody: { elem1: "rust", chance: 0.003 },
      fire: { elem1: "rust", chance: 0.0025 },
      coffee: { elem1: "rust", chance: 0.0003 },
      tea: { elem1: "rust", chance: 0.0003 },
      broth: { elem1: "rust", chance: 0.0003 },
      juice: { elem1: "rust", chance: 0.0003 },
      nut_milk: { elem1: "rust", chance: 0.0003 }
    }
  },
  "copper": {
    color: [
          "#a95232",
          "#be4322",
          "#c76035"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 8960,
    tempHigh: 1085,
    conduct: 0.95,
    fireColor: [
          "#07BA4F",
          "#00BC5B",
          "#00C2A9",
          "#11B7E7",
          "#C6F2EC"
        ],
    hardness: 0.3,
    reactions: {
      blood: { elem1: "oxidized_copper", chance: 0.003 },
      infection: { elem1: "oxidized_copper", chance: 0.003 },
      antibody: { elem1: "oxidized_copper", chance: 0.003 },
      fire: { elem1: "oxidized_copper", chance: 0.0025 }
    }
  },
  "gold": {
    color: [
          "#FFFDDE",
          "#FDF55F",
          "#FAD64A",
          "#EAB115",
          "#DC9710"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 19300,
    tempHigh: 1064,
    conduct: 0.81,
    breakInto: "gold_coin",
    hardness: 0.25
  },
  "steel": {
    color: "#71797e",
    behavior: behaveWall,
    category: "solids",
    density: 7850,
    tempHigh: 1455.5,
    conduct: 0.42,
    hardness: 0.8,
    reactions: {
      water: { elem1: "rust", chance: 0.002 },
      salt_water: { elem1: "rust", chance: 0.004 },
      dirty_water: { elem1: "rust", chance: 0.03 },
      pool_water: { elem1: "rust", chance: 0.03 },
      sugar_water: { elem1: "rust", chance: 0.003 },
      seltzer: { elem1: "rust", chance: 0.005 },
      salt: { elem1: "rust", chance: 0.003 },
      blood: { elem1: "rust", chance: 0.002 },
      infection: { elem1: "rust", chance: 0.002 },
      antibody: { elem1: "rust", chance: 0.002 },
      coffee: { elem1: "rust", chance: 0.0002 },
      tea: { elem1: "rust", chance: 0.0002 },
      broth: { elem1: "rust", chance: 0.0002 },
      juice: { elem1: "rust", chance: 0.0002 },
      nut_milk: { elem1: "rust", chance: 0.0002 }
    },
    colorKey: {
          L: "#888f94",
          B: "#71797e"
        },
    colorPattern: [
          "BBLB",
          "BBBL",
          "BLBB",
          "LBBB"
        ],
    grain: 0.5
  },
  "galvanized_steel": {
    color: "#99a7b0",
    behavior: behaveWall,
    category: "solids",
    density: 7850,
    tempHigh: 1200,
    hidden: true,
    conduct: 0.475,
    hardness: 0.8,
    colorKey: {
          L: "#99a7b0",
          B: "#859199"
        },
    colorPattern: [
          "BBLB",
          "BLBL",
          "LBBB"
        ],
    grain: 0.5
  },
  "zinc": {
    color: [
          "#666466",
          "#817e81",
          "#9a989a"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 7068,
    tempHigh: 419.53,
    conduct: 0.53,
    fireColor: [
          "#91B797",
          "#CAE4CA",
          "#F1F2F0"
        ],
    hardness: 0.25,
    superconductAt: -272.25
  },
  "silver": {
    color: "#cacaca",
    behavior: behaveWall,
    category: "solids",
    density: 10497,
    tempHigh: 961.8,
    conduct: 0.99,
    hardness: 0.25
  },
  "tin": {
    color: [
          "#9e9d98",
          "#aeada4"
        ],
    category: "solids",
    density: 7260,
    tempHigh: 231.9,
    conduct: 0.45,
    fireColor: [
          "#DBD1E9",
          "#D7E9F2",
          "#9AB0D1"
        ],
    hardness: 0.15,
    movable: false,
    superconductAt: -269.45
  },
  "lead": {
    color: [
          "#6c6c6a",
          "#838381"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 11343,
    tempHigh: 327.5,
    conduct: 0.41,
    fireColor: [
          "#DBD1E9",
          "#D7E9F2",
          "#9AB0D1"
        ],
    hardness: 0.15,
    superconductAt: -265.95
  },
  "nickel": {
    color: [
          "#695c52",
          "#827362",
          "#998b71"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 8900,
    tempHigh: 1455,
    conduct: 0.51,
    fireColor: "#fff1d4",
    hardness: 0.4
  },
  "aluminum": {
    color: [
          "#d1c6be",
          "#b5c0ad",
          "#b9b8bc"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 2710,
    tempHigh: 660.3,
    conduct: 0.73,
    breakInto: "metal_scrap",
    fireColor: "#A7B3BF",
    hardness: 0.05,
    darkText: true,
    reactions: {
      radiation: { elem2: "electric", temp1: 200 }
    },
    superconductAt: -271.95
  },
  "tungsten": {
    color: [
          "#BBB3A2",
          "#D4D4CA"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 19300,
    tempHigh: 3422,
    conduct: 0.65,
    fireColor: "#59ff4d",
    hardness: 0.75,
    grain: 5,
    superconductAt: -270.65
  },
  "molten_tungsten": {
    color: [
          "#ffff67",
          "#ffd367",
          "#ff9e00",
          "#d1ff5c",
          "#5cffb0",
          "#0073ff",
          "#ca57ff",
          "#ffba57",
          "#ff8c00",
          "#c46f28",
          "#c45928",
          "#c44300"
        ]
  },
  "brass": {
    color: [
          "#e4be6c",
          "#cc965c",
          "#ab7c49"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 8550,
    tempHigh: 927,
    hidden: true,
    conduct: 0.52,
    hardness: 0.275,
    reactions: {
      ammonia: { elem1: "metal_scrap", color1: [
                "#cb9e5d",
                "#865e39"
              ], chance: 0.01 }
    }
  },
  "bronze": {
    color: [
          "#e4aa6d",
          "#cc875c",
          "#ab6c4a"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 8150,
    tempHigh: 913,
    hidden: true,
    conduct: 0.44,
    hardness: 0.225,
    reactions: {
      water: { elem1: "oxidized_copper", chance: 0.00125 },
      salt_water: { elem1: "oxidized_copper", chance: 0.0025 },
      dirty_water: { elem1: "oxidized_copper", chance: 0.02 },
      pool_water: { elem1: "oxidized_copper", chance: 0.02 },
      sugar_water: { elem1: "oxidized_copper", chance: 0.00175 },
      seltzer: { elem1: "oxidized_copper", chance: 0.003 },
      blood: { elem1: "oxidized_copper", chance: 0.0015 },
      infection: { elem1: "oxidized_copper", chance: 0.0015 },
      antibody: { elem1: "oxidized_copper", chance: 0.0015 }
    }
  },
  "invar": {
    color: [
          "#36322c",
          "#302e29",
          "#2e2d29"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 8100,
    tempHigh: 1427,
    hidden: true,
    conduct: 0.49,
    hardness: 0.35,
    grain: 0.5
  },
  "sterling": {
    color: "#D4D4D4",
    behavior: behaveWall,
    category: "solids",
    density: 10375.25,
    tempHigh: 802,
    hidden: true,
    conduct: 0.95,
    hardness: 0.275,
    grain: 0.3
  },
  "gallium": {
    color: [
          "#b3b3b3",
          "#cccccc",
          "#dbdbdb"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 5100,
    tempHigh: 29.76,
    conduct: 0.05,
    hardness: 0.15,
    superconductAt: -272.15
  },
  "molten_gallium": {
    color: [
          "#f7f7f7",
          "#d9d7d7"
        ],
    behavior: behaveLiquid,
    density: 6095,
    tempHigh: 2400,
    tempLow: 29.76,
    stateLow: "gallium",
    stain: 0.05,
    reactions: {
      aluminum: { elem1: [
                "molten_gallium",
                "molten_gallium",
                "alga"
              ], chance: 0.01 },
      molten_aluminum: { elem1: "alga", elem2: "molten_alga", chance: 0.05 },
      steel: { elem2: "iron", chance: 0.005 },
      gold: { elem2: "blue_gold", chance: 0.01 },
      gold_coin: { elem2: "blue_gold", chance: 0.01 }
    }
  },
  "gallium_gas": {
    density: 6.31
  },
  "rose_gold": {
    color: [
          "#f58f8f",
          "#d06c6c",
          "#f58f8f"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 12900,
    tempHigh: 897,
    hidden: true,
    conduct: 0.87,
    breakInto: "gold_coin",
    hardness: 0.275,
    breakIntoColor: [
          "#f58f8f",
          "#d06c6c",
          "#f58f8f"
        ]
  },
  "purple_gold": {
    color: [
          "#ee8ef5",
          "#c96cd0",
          "#ee8ef5"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 11005,
    tempHigh: 1060,
    hidden: true,
    conduct: 0.87,
    breakInto: "gold_coin",
    hardness: 0.15,
    breakIntoColor: [
          "#f58fda",
          "#d06cb5",
          "#f58fda"
        ]
  },
  "blue_gold": {
    color: [
          "#94c2c7",
          "#7ba3b2",
          "#94c2c7"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 12900,
    tempHigh: 491,
    hidden: true,
    conduct: 0.87,
    breakInto: "gold_coin",
    hardness: 0.275,
    breakIntoColor: [
          "#94c2c7",
          "#7ba3b2",
          "#94c2c7"
        ]
  },
  "electrum": {
    color: [
          "#c5c794",
          "#b0b27b",
          "#c5c794"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 13750,
    tempHigh: 1063.9,
    hidden: true,
    conduct: 0.9,
    breakInto: "gold_coin",
    hardness: 0.25,
    alias: "green gold",
    breakIntoColor: [
          "#c5c794",
          "#b0b27b",
          "#c5c794"
        ]
  },
  "pyrite": {
    color: [
          "#f7f6e8",
          "#d6d285",
          "#d1bf75",
          "#b3974d",
          "#a48546"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 4900,
    tempHigh: 1182.5,
    hidden: true,
    conduct: 0.5,
    hardness: 0.6,
    alias: [
          "fool's gold",
          "iron sulfide"
        ]
  },
  "solder": {
    color: [
          "#a1a19d",
          "#b4b4b1"
        ],
    behavior: behaveWall,
    category: "solids",
    density: 8885,
    tempHigh: 200,
    hidden: true,
    conduct: 0.43,
    hardness: 0.15
  },
  "amber": {
    color: "#c87c1b",
    behavior: behaveWall,
    state: "solid",
    category: "solids",
    density: 1070,
    temp: 20,
    tempHigh: 345,
    stateHigh: "smoke",
    breakInto: [
          null,
          null,
          "sap"
        ]
  },
  "molten_copper": {
    density: 8020,
    reactions: {
      molten_zinc: { elem2: "molten_brass" },
      molten_tin: { elem2: "molten_bronze" },
      molten_silver: { elem2: "molten_sterling" },
      molten_gold: { elem2: "molten_rose_gold" },
      molten_sulfur: { elem2: "molten_copper_sulfate" },
      sulfur_gas: { elem2: "molten_copper_sulfate" }
    }
  },
  "molten_copper_sulfate": {
    tempLow: 100,
    stateLow: "copper_sulfate",
    reactions: {
      fire: { elem2: "poison_gas", chance: 0.1 }
    }
  },
  "molten_gold": {
    density: 17310,
    reactions: {
      molten_silver: { elem2: "molten_electrum" },
      molten_aluminum: { elem2: "molten_purple_gold" },
      molten_gallium: { elem2: "molten_blue_gold" },
      molten_alga: { elem1: "molten_purple_gold", elem2: "molten_blue_gold" },
      gallium_gas: { elem2: "molten_blue_gold" }
    }
  },
  "molten_silver": {
    density: 9320
  },
  "molten_iron": {
    density: 6980,
    reactions: {
      charcoal: { elem1: "molten_steel" },
      diamond: { elem1: "molten_steel" },
      carbon_dioxide: { elem1: "molten_steel" },
      molten_nickel: { elem1: "molten_invar" }
    }
  },
  "molten_nickel": {
    density: 7810
  },
  "molten_tin": {
    density: 6990,
    reactions: {
      molten_lead: { elem2: "molten_solder" }
    }
  },
  "molten_lead": {
    density: 10660
  },
  "molten_solder": {
    color: [
          "#94A4B0",
          "#AFBBC9",
          "#CCD6E5",
          "#FFFFFF"
        ],
    behavior: behaveLiquid
  },
  // -------------------- LIQUIDS --------------------

  "juice": {
    color: "#f0bf3d",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1054,
    tempHigh: 160,
    tempLow: -10,
    stateHigh: [
          "steam",
          "sugar"
        ],
    stain: 0.05,
    stateLowColorMultiplier: 1.1,
    reactions: {
      seltzer: { elem1: "soda", elem2: "foam", color1: "#ff9021" },
      carbon_dioxide: { elem1: "soda", elem2: "foam", color1: "#ff9021" },
      sugar: { chance: 0.005 }
    },
    isFood: true
  },
  "juice_ice": {
    breakInto: "slush",
    stateHighColorMultiplier: 0.91
  },
  // -------------------- FOOD --------------------

  "broth": {
    color: "#dbb169",
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 1052,
    tempHigh: 130,
    tempLow: 0,
    stateHigh: [
          "steam",
          "steam",
          "steam",
          "fragrance"
        ],
    hidden: true,
    conduct: 0.03,
    stain: -0.01,
    extinguish: true,
    alias: "soup",
    reactions: {
      petal: { color1: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E",
                "#CC9978",
                "#CD8C6F",
                "#BE785E",
                "#A9D475",
                "#5AF353",
                "#8E5FA5"
              ], tempMin: 70, chance: 0.01 },
      pistil: { color1: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E",
                "#CC9978",
                "#CD8C6F",
                "#BE785E",
                "#A9D475",
                "#5AF353",
                "#8E5FA5"
              ], tempMin: 70, chance: 0.01 },
      potato: { color1: "#DFD0CB", tempMin: 70, chance: 0.05 },
      melted_cheese: { color1: "#dbc469", tempMin: 70, chance: 0.05 },
      beans: { color1: "#db9769", tempMin: 70, chance: 0.05 },
      wheat: { color1: "#dbbd8a", tempMin: 70, chance: 0.05 },
      kelp: { color1: "#7dba57", tempMin: 70, chance: 0.05 },
      tomato: { color1: "#F9A24E", tempMin: 70, chance: 0.05 },
      sauce: { color1: "#F9A24E", tempMin: 70, chance: 0.05 },
      ketchup: { color1: "#F9A24E", tempMin: 70, chance: 0.05 },
      mushroom_stalk: { color1: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ], tempMin: 70, chance: 0.05 },
      mushroom_cap: { color1: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ], tempMin: 70, chance: 0.05 },
      mushroom_gill: { color1: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ], tempMin: 70, chance: 0.05 },
      hyphae: { color1: [
                "#CC9978",
                "#CD8C6F",
                "#BE785E"
              ], tempMin: 70, chance: 0.05 }
    },
    isFood: true
  },
  // -------------------- LIQUIDS --------------------

  "milk": {
    color: "#fafafa",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1036.86,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: [
          "steam",
          "bubble",
          "cream",
          "cream",
          "sugar"
        ],
    stateLow: "ice_cream",
    viscosity: 1.5,
    stateLowColorMultiplier: [
          0.97,
          0.93,
          0.87
        ],
    reactions: {
      melted_chocolate: { elem1: "chocolate_milk" },
      chocolate: { elem1: "chocolate_milk", elem2: "melted_chocolate", chance: 0.05 },
      chocolate_powder: { elem1: "chocolate_milk", elem2: "melted_chocolate", chance: 0.2 },
      juice: { elem1: "fruit_milk", chance: 0.05 },
      soda: { elem1: "pilk", chance: 0.1 },
      yolk: { elem1: "eggnog", chance: 0.1 },
      ash: { elem1: "soap", chance: 0.1 },
      caramel: { color1: "#C8B39A", chance: 0.05 },
      sugar: { chance: 0.005 }
    },
    isFood: true
  },
  "chocolate_milk": {
    color: "#664934",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1181,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: [
          "steam",
          "bubble",
          "cream",
          "cream",
          "sugar"
        ],
    stateLow: "ice_cream",
    hidden: true,
    viscosity: 1.5,
    stateLowColorMultiplier: [
          0.97,
          0.93,
          0.87
        ],
    isFood: true
  },
  "fruit_milk": {
    color: "#c9988f",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1045,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: [
          "steam",
          "bubble",
          "cream",
          "cream",
          "sugar"
        ],
    stateLow: "ice_cream",
    hidden: true,
    viscosity: 1.5,
    stateLowColorMultiplier: [
          0.97,
          0.93,
          0.87
        ],
    isFood: true
  },
  "pilk": {
    color: "#e9cba3",
    behavior: [
          "XX|CR:foam%1|XX",
          "M2|XX|M2",
          "M2|M1|M2"
        ],
    category: "liquids",
    state: "liquid",
    density: 1033,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: [
          "steam",
          "bubble",
          "cream",
          "cream",
          "sugar"
        ],
    stateLow: "ice_cream",
    hidden: true,
    viscosity: 1.25,
    stateLowColorMultiplier: [
          0.97,
          0.93,
          0.87
        ],
    isFood: true
  },
  "eggnog": {
    color: "#ddbf98",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1033,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: [
          "steam",
          "bubble",
          "cream",
          "cream",
          "sugar"
        ],
    stateLow: "ice_cream",
    hidden: true,
    viscosity: 1.5,
    stateLowColorMultiplier: [
          0.97,
          0.93,
          0.87
        ],
    isFood: true
  },
  // -------------------- FOOD --------------------

  "egg": {
    color: "#e0d3ab",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1031,
    tempHigh: 1500,
    stateHigh: [
          "steam",
          "calcium",
          "carbon_dioxide",
          "sulfur_gas"
        ],
    breakInto: "yolk",
    ignore: [
          "paper",
          "sponge",
          "straw",
          "wheat",
          "rat",
          "frog",
          "pollen",
          "clay",
          "snow",
          "mud",
          "wet_sand",
          "tinder",
          "feather",
          "bread",
          "ice_cream",
          "dough"
        ],
    cooldown: 30,
    properties: {
          fall: 0
        },
    innerColor: "#ffffff"
  },
  "yolk": {
    color: [
          "#ffbe33",
          "#ffcf33"
        ],
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 1027.5,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "hard_yolk",
    stateLow: "hard_yolk",
    viscosity: 270,
    reactions: {
      dna: { elem1: "homunculus", chance: 0.05 }
    },
    isFood: true
  },
  "hard_yolk": {
    color: "#dead43",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1031,
    tempHigh: 400,
    stateHigh: "smoke",
    hidden: true,
    alias: "fried egg",
    isFood: true
  },
  // -------------------- LIQUIDS --------------------

  "cream": {
    color: "#f7f7f7",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 959.97,
    tempHigh: 200,
    tempLow: 0,
    stateHigh: [
          "steam",
          "bubble",
          "sugar"
        ],
    stateLow: "ice_cream",
    hidden: true,
    viscosity: 1.5,
    stateLowColorMultiplier: 0.97,
    reactions: {
      melted_chocolate: { color1: "#664934" },
      chocolate: { color1: "#664934", elem2: "melted_chocolate", chance: 0.05 },
      chocolate_powder: { color1: "#664934", elem2: "melted_chocolate", chance: 0.1 },
      juice: { elem1: "fruit_milk", chance: 0.05 },
      soda: { elem1: "pilk", chance: 0.1 },
      yolk: { elem1: "eggnog", chance: 0.1 },
      caramel: { color1: "#C8B39A", chance: 0.05 },
      sugar: { chance: 0.005 }
    },
    isFood: true
  },
  "nut_milk": {
    color: "#D7D1C3",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1107.41,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "steam",
    stateLow: "ice",
    hidden: true,
    conduct: 0.005,
    viscosity: 1.5,
    stain: -0.1,
    desc: "Dairy-free!",
    isFood: true
  },
  // -------------------- FOOD --------------------

  "dough": {
    color: "#bfac91",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 526.9,
    tempHigh: 94,
    stateHigh: "bread",
    burn: 40,
    burnTime: 25,
    burnInto: "ash",
    reactions: {
      milk: { elem2: "broth", color2: "#ECC891", tempMin: 70 },
      cream: { elem2: "dough", tempMin: 40, chance: 0.01 },
      yeast: { elem2: "dough", tempMin: 40, chance: 0.01 },
      baking_soda: { elem2: "dough", tempMin: 40, chance: 0.01 },
      quicklime: { elem2: "dough", tempMin: 40, chance: 0.01 }
    },
    isFood: true
  },
  "batter": {
    color: "#d4bc85",
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 1001,
    tempHigh: 94,
    stateHigh: "baked_batter",
    hidden: true,
    viscosity: 10000,
    burn: 40,
    burnTime: 25,
    burnInto: "ash",
    stateHighColorMultiplier: 0.9,
    reactions: {
      yeast: { elem2: "batter", tempMin: 40, chance: 0.01 },
      cream: { elem2: "batter", tempMin: 40, chance: 0.01 },
      baking_soda: { elem2: "batter", tempMin: 40, chance: 0.01 },
      quicklime: { elem2: "batter", tempMin: 40, chance: 0.01 }
    },
    isFood: true
  },
  // -------------------- LIFE --------------------

  "homunculus": {
    color: [
          "#c4b270",
          "#9c916a",
          "#9e8955",
          "#a89a76"
        ],
    behavior: [
          "XX|XX|XX",
          "M2%0.5|XX|M2%0.5",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 1450,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "meat",
    stateLow: "frozen_meat",
    hidden: true,
    breakInto: [
          "blood",
          "slime"
        ],
    reactions: {
      milk: { chance: 0.025 },
      blood: { chance: 0.05 },
      sugar: { chance: 0.025 },
      meat: { chance: 0.001 },
      cooked_meat: { chance: 0.0005 },
      oxygen: { elem2: "carbon_dioxide" },
      radiation: { elem1: [
                "human",
                "skin"
              ] }
    }
  },
  // -------------------- FOOD --------------------

  "butter": {
    color: "#ffe46b",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 860,
    tempHigh: 33,
    stateHigh: "melted_butter",
    reactions: {
      caustic_potash: { elem1: "soap", elem2: "soap" },
      sugar: { elem1: "icing", elem2: "icing" }
    },
    isFood: true
  },
  "cheese": {
    color: "#fcba03",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 477.62,
    tempHigh: 54,
    stateHigh: "melted_cheese",
    breakInto: "cheese_powder",
    reactions: {
      dirty_water: { elem1: "rotten_cheese", chance: 0.1 },
      stench: { elem1: "rotten_cheese", chance: 0.2 },
      fly: { elem1: "rotten_cheese", chance: 0.2 },
      dioxin: { elem1: "rotten_cheese", chance: 0.1 },
      uranium: { elem1: "rotten_cheese", chance: 0.1 },
      cancer: { elem1: "rotten_cheese", chance: 0.1 },
      plague: { elem1: "rotten_cheese", chance: 0.3 },
      ant: { elem1: "rotten_cheese", chance: 0.1 },
      worm: { elem1: "rotten_cheese", chance: 0.1 },
      rat: { elem1: "rotten_cheese", chance: 0.1 },
      mushroom_spore: { elem1: "rotten_cheese", chance: 0.1 },
      mushroom_stalk: { elem1: "rotten_cheese", chance: 0.1 },
      mercury: { elem1: "rotten_cheese", chance: 0.2 },
      mercury_gas: { elem1: "rotten_cheese", chance: 0.1 },
      virus: { elem1: "rotten_cheese", chance: 0.1 },
      poison: { elem1: "rotten_cheese", chance: 0.5 },
      infection: { elem1: "rotten_cheese", chance: 0.1 },
      ink: { elem1: "rotten_cheese", chance: 0.1 },
      acid: { elem1: "rotten_cheese", chance: 0.5 },
      acid_gas: { elem1: "rotten_cheese", chance: 0.4 },
      cyanide: { elem1: "rotten_cheese", chance: 0.5 },
      cyanide_gas: { elem1: "rotten_cheese", chance: 0.5 },
      rotten_meat: { elem1: "rotten_cheese", chance: 0.02 },
      rad_steam: { elem1: "rotten_cheese", chance: 0.1 }
    },
    breakIntoColorMultiplier: [
          1.1,
          1,
          0.86
        ],
    isFood: true
  },
  "rotten_cheese": {
    color: [
          "#ffcc40",
          "#c1b338",
          "#839930"
        ],
    behavior: [
          "XX|CR:plague,stench,stench,stench,fly%0.25 AND CH:cheese,cheese_powder>rotten_cheese%1|XX",
          "CH:cheese,cheese_powder>rotten_cheese%1|XX|CH:cheese,cheese_powder>rotten_cheese%1",
          "XX|M1 AND CH:cheese,cheese_powder>rotten_cheese%1|XX"
        ],
    category: "food",
    state: "solid",
    density: 470,
    tempHigh: 54,
    stateHigh: [
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "melted_cheese",
          "stench"
        ],
    hidden: true,
    isFood: true
  },
  "cheese_powder": {
    color: [
          "#ffcc40",
          "#fcba03",
          "#d99f00"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 470,
    tempHigh: 54,
    stateHigh: "melted_cheese",
    hidden: true,
    isFood: true
  },
  "chocolate": {
    color: "#4d2818",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1325,
    tempHigh: 31,
    stateHigh: "melted_chocolate",
    breakInto: "chocolate_powder",
    isFood: true
  },
  "chocolate_powder": {
    color: [
          "#4d2818",
          "#3b1b0d",
          "#33160a"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 1325,
    tempHigh: 31,
    stateHigh: "melted_chocolate",
    hidden: true,
    isFood: true
  },
  "grape": {
    color: [
          "#b84b65",
          "#a10e69",
          "#a10e95",
          "#8a3eab"
        ],
    behavior: [
          "XX|ST:vine|XX",
          "ST:vine|XX|ST:vine",
          "M2|M1|M2"
        ],
    category: "food",
    state: "solid",
    density: 1154,
    tempHigh: 256,
    stateHigh: [
          "steam",
          "sugar"
        ],
    breakInto: "juice",
    ignoreAir: true,
    reactions: {
      radiation: { elem1: "explosion", chance: 0.1, color1: "#291824" },
      rock: { elem1: "juice", chance: 0.1, color1: "#291824" },
      concrete: { elem1: "juice", chance: 0.1, color1: "#291824" },
      basalt: { elem1: "juice", chance: 0.1, color1: "#291824" },
      limestone: { elem1: "juice", chance: 0.1, color1: "#291824" },
      tuff: { elem1: "juice", chance: 0.1, color1: "#291824" },
      water: { elem2: "juice", chance: 0.005, color2: "#291824" },
      sugar_water: { elem2: "juice", chance: 0.025, color2: "#291824" },
      acid: { elem1: "juice", color1: "#291824" },
      acid_gas: { elem1: "juice", color1: "#291824" }
    },
    innerColor: "#cc7492",
    breakIntoColor: "#291824",
    isFood: true
  },
  // -------------------- LIQUIDS --------------------

  "vinegar": {
    color: "#ffecb3",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1006,
    tempHigh: 100.6,
    tempLow: -2.22,
    stateHigh: [
          "steam",
          "carbon_dioxide",
          "methane"
        ],
    stateLowName: "frozen_vinegar",
    viscosity: 12,
    stain: -0.8,
    reactions: {
      milk: { elem2: "cheese" },
      cream: { elem2: "cheese" },
      pilk: { elem2: "cheese", color2: "#d6b57a" },
      fruit_milk: { elem2: "cheese", color2: "#c2864e" },
      chocolate_milk: { elem2: "cheese", color2: "#6b4000" },
      eggnog: { elem2: "cheese", color2: "#ffdb63" },
      nut_milk: { elem2: "cheese", color2: "#ded0ad" },
      yogurt: { elem2: "cheese" },
      baking_soda: { elem1: "sodium_acetate", elem2: "carbon_dioxide", attr1: {
                foam: 20
              } },
      limestone: { elem1: "sodium_acetate", elem2: "carbon_dioxide", attr1: {
                foam: 5
              } },
      rust: { elem2: "iron", chance: 0.05 },
      oxidized_copper: { elem2: "copper", chance: 0.05 },
      egg: { elem2: "pickle", color2: "#e0e0ab", chance: 0.01 },
      yolk: { elem1: "mayo", elem2: "mayo", chance: 0.1 },
      mushroom_spore: { chance: 0.05 },
      mushroom_gill: { chance: 0.05 },
      mushroom_cap: { chance: 0.05 },
      pollen: { chance: 0.05 },
      caramel: { chance: 0.01 },
      salt: { elem2: "sodium_acetate", chance: 0.05 },
      lettuce: { elem2: "pickle", chance: 0.01 },
      tomato: { elem2: "pickle", color2: "#fa6e11", chance: 0.01 },
      grape: { elem2: "pickle", color2: "#b86a4b", chance: 0.01 },
      pumpkin: { elem2: "pickle", color2: "#ffa42e", chance: 0.01 }
    },
    isFood: true
  },
  // -------------------- FOOD --------------------

  "herb": {
    color: [
          "#2e5a09",
          "#3c6a16",
          "#507b28",
          "#759d3c"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 1400,
    tempHigh: 300,
    tempLow: -2,
    stateHigh: [
          "fire",
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    stateLow: "frozen_plant",
    burn: 10,
    burnTime: 300,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "fragrance"
        ],
    reactions: {
      water: { elem2: "tea", tempMin: 80 },
      salt_water: { elem2: "tea", tempMin: 80 },
      sugar_water: { elem2: "tea", tempMin: 80 },
      seltzer: { elem2: "tea", tempMin: 80 },
      stench: { chance: 0.25 },
      steam: { elem2: "fragrance", chance: 0.1 },
      flea: { chance: 0.01 },
      termite: { chance: 0.01 },
      fly: { chance: 0.01 },
      ant: { chance: 0.01 },
      stink_bug: { chance: 0.01 }
    },
    isFood: true
  },
  "lettuce": {
    color: [
          "#a2c96b",
          "#81C520",
          "#639917"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 1400,
    tempHigh: 300,
    stateHigh: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash"
        ],
    burn: 5,
    burnTime: 500,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash"
        ],
    isFood: true
  },
  "pickle": {
    color: [
          "#afc520",
          "#999517"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 625,
    tempHigh: 300,
    stateHigh: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash",
          "carbon_dioxide",
          "alcohol_gas"
        ],
    burn: 1,
    burnTime: 500,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash",
          "carbon_dioxide",
          "alcohol_gas"
        ],
    breakInto: "juice",
    breakIntoColor: "#CF9F08",
    isFood: true
  },
  "tomato": {
    color: [
          "#FA4611",
          "#FF5615",
          "#FF7833"
        ],
    behavior: [
          "XX|ST:vine|XX",
          "ST:vine|XX|ST:vine",
          "XX|M1|XX"
        ],
    category: "food",
    state: "solid",
    density: 1014.42,
    tempHigh: 300,
    stateHigh: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash"
        ],
    burn: 1,
    burnTime: 500,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash"
        ],
    breakInto: "sauce",
    reactions: {
      rock: { elem1: "sauce", chance: 0.1 },
      concrete: { elem1: "sauce", chance: 0.1 },
      basalt: { elem1: "sauce", chance: 0.1 },
      limestone: { elem1: "sauce", chance: 0.1 },
      tuff: { elem1: "sauce", chance: 0.1 }
    },
    isFood: true
  },
  "sauce": {
    color: [
          "#bf1600",
          "#bf2300",
          "#bf3600"
        ],
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 1031.33,
    tempHigh: 260,
    tempLow: -2,
    stateHigh: [
          "steam",
          "salt"
        ],
    viscosity: 2600,
    stain: 0.01,
    reactions: {
      sugar: { elem1: "ketchup", chance: 0.1 },
      sugar_water: { elem1: "ketchup", elem2: "water", chance: 0.1 },
      vinegar: { elem1: "ketchup", chance: 0.1 },
      stench: {  },
      salt: { chance: 0.005 }
    },
    isFood: true
  },
  "pumpkin": {
    color: [
          "#ff822e",
          "#ff8c2e"
        ],
    behavior: behaveWall,
    category: "food",
    state: "solid",
    density: 490.3,
    tempHigh: 800,
    stateHigh: "ash",
    breakInto: [
          null,
          null,
          null,
          null,
          null,
          "pumpkin_seed"
        ],
    movable: false,
    seed: "pumpkin_seed",
    isFood: true
  },
  // -------------------- LIFE --------------------

  "pumpkin_seed": {
    color: [
          "#FFE9CA",
          "#ffdcc2",
          "#ffcaab"
        ],
    behavior: behaveSeedrise,
    category: "life",
    state: "solid",
    density: 950.33,
    tempHigh: 400,
    tempLow: -2,
    stateHigh: "fire",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 50,
    burnTime: 20,
    cooldown: 30,
    seed: true,
    isFood: true
  },
  // -------------------- FOOD --------------------

  "corn": {
    color: [
          "#f8d223",
          "#d6ba2a",
          "#f7f5ba",
          "#dbd281",
          "#cdb12d"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 721,
    tempHigh: 180,
    stateHigh: "popcorn",
    burn: 10,
    burnTime: 200,
    breakInto: "flour",
    seed: "corn_seed",
    breakIntoColor: [
          "#ffe9a8",
          "#ffecb3",
          "#ffe28a"
        ],
    isFood: true
  },
  "popcorn": {
    color: [
          "#a6a076",
          "#ebe4ab",
          "#ebe4ab",
          "#ebe4ab",
          "#ebe4ab",
          "#ebe4ab",
          "#ebe4ab",
          "#c99947"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 360.5,
    tempHigh: 500,
    stateHigh: "ash",
    hidden: true,
    burn: 20,
    burnTime: 200,
    burnInto: [
          "fire",
          "ash"
        ],
    isFood: true
  },
  // -------------------- LIFE --------------------

  "corn_seed": {
    color: [
          "#f9e3ba",
          "#f2b813"
        ],
    behavior: [
          "XX|M2%0.25|XX",
          "XX|L2:plant,corn AND C2:corn%30|XX",
          "XX|M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 721,
    tempHigh: 400,
    tempLow: -2,
    stateHigh: "fire",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 50,
    burnTime: 20,
    cooldown: 30,
    seed: true
  },
  // -------------------- FOOD --------------------

  "potato": {
    color: [
          "#d99857",
          "#d98757",
          "#a66933"
        ],
    behavior: [
          "XX|SH:wire%1|XX",
          "SH:wire%1|XX|SH:wire%1",
          "M2|M1 AND SH:wire%1|M2"
        ],
    category: "food",
    state: "solid",
    density: 675,
    tempHigh: 176,
    stateHigh: "baked_potato",
    burn: 10,
    burnTime: 300,
    burnInto: "ash",
    breakInto: "mashed_potato",
    reactions: {
      zinc: { charge2: 1, chance: 0.01 },
      copper: { charge2: 1, chance: 0.01 }
    },
    seed: "potato_seed",
    innerColor: "#e3c688",
    isFood: true
  },
  "baked_potato": {
    color: [
          "#F5B72F",
          "#E89F0C",
          "#9f7501"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 675,
    tempHigh: 400,
    stateHigh: "ash",
    hidden: true,
    burn: 20,
    burnTime: 300,
    burnInto: "ash",
    breakInto: "crumb",
    breakIntoColor: [
          "#f6be46",
          "#F5B72F",
          "#f5b324",
          "#f4aa0b",
          "#f3ab1b",
          "#E89F0C",
          "#d08f0b",
          "#b87e0a",
          "#b28201",
          "#9f7501"
        ],
    isFood: true
  },
  "mashed_potato": {
    color: [
          "#F7F6E4",
          "#F0ECD4",
          "#E4D38B"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 675,
    tempHigh: 400,
    stateHigh: [
          "ash",
          "steam",
          null,
          null,
          null
        ],
    hidden: true,
    burn: 3,
    burnTime: 300,
    burnInto: [
          "ash",
          "steam",
          "smoke",
          "smoke",
          "smoke"
        ],
    isFood: true
  },
  // -------------------- LIFE --------------------

  "potato_seed": {
    color: [
          "#cda57f",
          "#bc9563",
          "#aa7437"
        ],
    behavior: [
          "XX|CH:dirt>fiber|XX",
          "CH:dirt>potato%5|CH:potato%1|CH:dirt>potato%5",
          "XX|SW:dirt%3 AND M1|XX"
        ],
    category: "life",
    state: "solid",
    density: 675,
    tempHigh: 400,
    tempLow: -2,
    stateHigh: "fire",
    stateLow: "frozen_plant",
    hidden: true,
    burn: 50,
    burnTime: 20,
    cooldown: 30,
    seed: true
  },
  "root": {
    color: "#80715b",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "CH:dirt,mud,sand,wet_sand,clay_soil,clay,mycelium,grass,color_sand>root,fiber%0.5|CH:dirt,mud,sand,wet_sand,clay_soil,clay,mycelium,grass,color_sand>root,fiber,fiber%0.5|CH:dirt,mud,sand,wet_sand,clay_soil,clay,mycelium,grass,color_sand>root,fiber%0.5"
        ],
    category: "life",
    state: "solid",
    density: 1250,
    tempHigh: 275,
    tempLow: -50,
    stateHigh: "dirt",
    stateLow: "fiber",
    hidden: true,
    conduct: 0.1,
    burn: 20,
    burnTime: 60,
    burnInto: "dirt",
    breakInto: "sawdust",
    reactions: {
      rock: { elem2: "sand", chance: 0.0004 },
      mud: { elem2: "dirt", chance: 0.005 },
      wet_sand: { elem2: "sand", chance: 0.005 },
      water: { chance: 0.005 },
      sugar_water: { chance: 0.008 }
    }
  },
  "fiber": {
    color: [
          "#6b563e",
          "#5c553e",
          "#42342d"
        ],
    behavior: behaveSturdyPowder,
    category: "life",
    state: "solid",
    density: 462,
    tempHigh: 275,
    tempLow: -50,
    stateHigh: "dirt",
    stateLow: "permafrost",
    hidden: true,
    burn: 20,
    burnTime: 60,
    burnInto: "dirt",
    breakInto: "tinder"
  },
  // -------------------- FOOD --------------------

  "yeast": {
    color: [
          "#ad9166",
          "#9a7f4e",
          "#d8bb8d"
        ],
    behavior: [
          "XX|CL:70%10|XX",
          "CL:70%10 AND SW:bread%30|XX|CL:70%10 AND SW:bread%30",
          "XX|M1|XX"
        ],
    category: "food",
    state: "solid",
    density: 1180,
    tempHigh: 110,
    stateHigh: "bread",
    burn: 50,
    burnTime: 20,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    reactions: {
      bread: { elem1: "bread" },
      potato: { elem2: "alcohol", chance: 0.005, color2: "#fec400" },
      mashed_potato: { elem2: "alcohol", chance: 0.005, color2: "#fec400" },
      grape: { elem2: "alcohol", chance: 0.005, color2: "#7d2a25" },
      juice: { elem2: "alcohol", chance: 0.015, color2: "#7d2a25" },
      sugar: { elem2: "alcohol", chance: 0.005, color2: "#80724d" },
      sugar_water: { elem2: "alcohol", chance: 0.005, color2: "#80724d" },
      soda: { elem2: "alcohol", chance: 0.005, color2: "#80724d" },
      corn: { elem2: "alcohol", chance: 0.005, color2: "#b8b6a2" },
      rice: { elem2: "alcohol", chance: 0.005, color2: "#ecc986" },
      wheat: { elem2: "alcohol", chance: 0.005, color2: "#FCD630" },
      honey: { elem2: "alcohol", chance: 0.005, color2: "#dccb72" },
      molasses: { elem2: "alcohol", chance: 0.005, color2: "#803924" },
      herb: { elem2: "tea", chance: 0.005 },
      milk: { elem2: "cheese", chance: 0.005 },
      oxygen: { elem2: "carbon_dioxide", chance: 0.05 },
      algae: { elem1: "lichen", elem2: "lichen", chance: 0.02 },
      bleach: { elem2: "foam", attr2: {
                foam: 40
              }, chance: 0.02, temp2: 75 }
    },
    isFood: true
  },
  "bread": {
    color: "#debd8c",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 233.96,
    tempHigh: 176,
    stateHigh: "toast",
    burn: 5,
    burnTime: 200,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: "crumb",
    reactions: {
      honey: { elem1: "gingerbread" },
      molasses: { elem1: "gingerbread" },
      sap: { elem1: "gingerbread" },
      caramel: { elem1: "gingerbread" }
    },
    isFood: true
  },
  "toast": {
    color: "#c08655",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 233.96,
    tempHigh: 550,
    stateHigh: "ash",
    burn: 10,
    burnTime: 200,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: "crumb",
    breakIntoColor: [
          "#c8946a",
          "#c08655",
          "#ba7a45",
          "#a86d3e"
        ],
    isFood: true
  },
  "gingerbread": {
    color: [
          "#a66530",
          "#bf773d",
          "#cc7d41"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "food",
    state: "solid",
    density: 233.96,
    tempHigh: 875,
    stateHigh: "ash",
    burn: 5,
    burnTime: 200,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: "crumb",
    breakIntoColor: [
          "#ba7136",
          "#a66530",
          "#8a5428",
          "#774822",
          "#c7844d",
          "#bf773d",
          "#ab6a36",
          "#975e30",
          "#d28c56",
          "#cc7d41",
          "#c97636",
          "#b56a30"
        ],
    isFood: true
  },
  "crumb": {
    color: [
          "#e2c69c",
          "#debd8c",
          "#d7b075",
          "#d2a665"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 233.96,
    tempHigh: 550,
    stateHigh: "ash",
    hidden: true,
    burn: 5,
    burnTime: 200,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    isFood: true
  },
  "baked_batter": {
    color: "#fcdf7e",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 233.96,
    tempHigh: 550,
    stateHigh: "ash",
    hidden: true,
    burn: 5,
    burnTime: 400,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash"
        ],
    breakInto: "crumb",
    isFood: true
  },
  "wheat": {
    color: [
          "#f1b569",
          "#edb864",
          "#de9c45",
          "#c2853d"
        ],
    behavior: behaveWall,
    category: "food",
    state: "solid",
    density: 769,
    tempHigh: 100,
    tempLow: -2,
    stateHigh: "straw",
    stateLow: "straw",
    burn: 25,
    burnTime: 200,
    breakInto: "flour",
    reactions: {
      rock: { elem1: "flour", elem2: "rock" },
      water: { elem2: "tea", tempMin: 80, color2: "#9e4c00" },
      salt_water: { elem2: "tea", tempMin: 80, color2: "#9e4c00" },
      sugar_water: { elem2: "tea", tempMin: 80, color2: "#9e4c00" },
      seltzer: { elem2: "tea", tempMin: 80, color2: "#9e4c00" }
    },
    seed: "wheat_seed",
    isFood: true
  },
  "rice": {
    color: [
          "#e8e3b3",
          "#d9d4a9",
          "#d1cb99",
          "#b3ad81"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 1182,
    tempHigh: 500,
    stateHigh: "fire",
    burn: 1,
    burnTime: 300,
    breakInto: "flour",
    darkText: true,
    reactions: {
      water: { elem2: "broth", color2: "#ebd394", tempMin: 70, chance: 0.2 },
      salt_water: { elem2: "broth", color2: "#ebd394", tempMin: 70, chance: 0.2 },
      sugar_water: { elem2: "broth", color2: "#ebd394", tempMin: 70, chance: 0.2 },
      dirty_water: {},
      pool_water: {},
      seltzer: {}
    },
    isFood: true
  },
  "candy": {
    color: "#e6cab1",
    behavior: behaveWall,
    category: "food",
    state: "solid",
    density: 900,
    tempHigh: 186,
    stateHigh: "caramel",
    breakInto: "sugar",
    hardness: 0.15,
    darkText: true,
    isFood: true
  },
  "coffee_bean": {
    color: [
          "#994528",
          "#772C12",
          "#5c2513",
          "#4a2416"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 650,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 10,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "fragrance"
        ],
    breakInto: [
          "coffee_ground",
          null
        ],
    reactions: {
      water: { elem2: "coffee", tempMin: 80 },
      salt_water: { elem2: "coffee", tempMin: 80 },
      sugar_water: { elem2: "melted_chocolate", tempMin: 65 },
      seltzer: { elem2: "coffee", tempMin: 80 },
      stench: {  },
      oxygen: { elem2: "fragrance", chance: 0.01 }
    },
    isFood: true
  },
  "coffee_ground": {
    color: [
          "#26130C",
          "#422213"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 1002,
    tempHigh: 400,
    stateHigh: "fire",
    hidden: true,
    burn: 25,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "fragrance"
        ],
    reactions: {
      water: { elem1: "coffee", elem2: "coffee", tempMin: 70 },
      salt_water: { elem1: "coffee", elem2: "coffee", tempMin: 70 },
      sugar_water: { elem1: "melted_chocolate", elem2: "melted_chocolate", tempMin: 60 },
      seltzer: { elem1: "coffee", elem2: "coffee", tempMin: 70 },
      milk: { elem1: "coffee", tempMin: 70 },
      coffee: { elem1: "coffee", tempMin: 70 },
      melted_chocolate: { elem1: "melted_chocolate", tempMin: 60 },
      stench: {  },
      oxygen: { elem2: "fragrance", chance: 0.01 },
      flea: { chance: 0.01 }
    },
    isFood: true
  },
  "nut": {
    color: [
          "#d69965",
          "#c98c57",
          "#b57a47",
          "#8f6038"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 325,
    tempHigh: 400,
    stateHigh: "fire",
    burn: 25,
    burnInto: [
          "fire",
          "smoke",
          "ash"
        ],
    breakInto: [
          "nut_meat",
          null
        ],
    reactions: {
      water: { elem2: "nut_milk", chance: 0.00025 },
      salt_water: { elem2: "nut_milk", chance: 0.00025 },
      sugar_water: { elem2: "nut_milk", chance: 0.00025 },
      seltzer: { elem2: "nut_milk", chance: 0.00025 },
      rock: { elem1: "nut_oil", chance: 0.02, tempMin: 60 },
      concrete: { elem1: "nut_oil", chance: 0.02, tempMin: 60 },
      basalt: { elem1: "nut_oil", chance: 0.02, tempMin: 60 },
      limestone: { elem1: "nut_oil", chance: 0.01, tempMin: 60 }
    },
    isFood: true
  },
  "nut_oil": {
    color: "#E7D784",
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 910,
    tempHigh: 250,
    stateHigh: [
          "fire",
          "smoke",
          "smoke",
          "smoke"
        ],
    viscosity: 38,
    darkText: true,
    alias: "cooking oil",
    reactions: {
      toast: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      crumb: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      baked_batter: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      baked_potato: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      steam: { elem1: "explosion", tempMin: 150, chance: 0.1 },
      yolk: { elem1: "mayo", elem2: "mayo", chance: 0.1 }
    },
    isFood: true
  },
  "nut_meat": {
    color: [
          "#deba8e",
          "#d1a56f",
          "#ba8b50"
        ],
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 905,
    tempHigh: 150,
    stateHigh: [
          "nut_butter",
          "nut_butter",
          "nut_butter",
          "nut_butter",
          "nut_butter",
          "nut_oil"
        ],
    hidden: true,
    burn: 20,
    burnInto: [
          "fire",
          "smoke"
        ],
    reactions: {
      water: { elem2: "nut_milk", chance: 0.0005 },
      salt_water: { elem2: "nut_milk", chance: 0.0005 },
      sugar_water: { elem2: "nut_milk", chance: 0.0005 },
      seltzer: { elem2: "nut_milk", chance: 0.0005 }
    },
    isFood: true
  },
  "nut_butter": {
    color: "#cd9141",
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 1090.5,
    tempHigh: 232,
    stateHigh: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "salt"
        ],
    hidden: true,
    viscosity: 200000,
    reactions: {
      salt: { chance: 0.005 },
      water: { elem1: "nut_milk", elem2: "nut_milk", chance: 0.05 },
      salt_water: { elem1: "nut_milk", elem2: "nut_milk", chance: 0.05 },
      sugar_water: { elem1: "nut_milk", elem2: "nut_milk", chance: 0.05 },
      seltzer: { elem1: "nut_milk", elem2: "nut_milk", chance: 0.05 }
    },
    isFood: true
  },
  "jelly": {
    color: "#A35298",
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 1245,
    tempHigh: 200,
    tempLow: -5,
    stateHigh: [
          "smoke",
          "sugar"
        ],
    stateLow: [
          "sugar_ice",
          "sugar_ice",
          "juice_ice"
        ],
    hidden: true,
    viscosity: 200000,
    alias: "jam",
    isFood: true
  },
  "baking_soda": {
    color: "#ededed",
    behavior: behavePowder,
    category: "food",
    state: "solid",
    density: 2200,
    tempHigh: 200,
    stateHigh: [
          "salt",
          "carbon_dioxide"
        ],
    alias: "sodium bicarbonate",
    reactions: {
      juice: { elem1: "water", elem2: [
                "carbon_dioxide",
                "foam"
              ] },
      chlorine: { elem1: [
                "carbon_dioxide",
                "seltzer",
                "salt",
                "salt_water",
                "water"
              ] },
      glue: { elem1: "slime", elem2: "slime", chance: 0.1 },
      yogurt: { elem1: "carbon_dioxide", chance: 0.01 },
      honey: { elem1: "carbon_dioxide", chance: 0.01 },
      molasses: { elem1: "carbon_dioxide", chance: 0.01 },
      melted_chocolate: { elem1: "carbon_dioxide", chance: 0.01 },
      soap: { elem1: [
                "carbon_dioxide",
                "water"
              ], elem2: "bubble", chance: 0.01 }
    },
    isFood: true
  },
  "yogurt": {
    color: "#f0efe6",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2%5|M1|M2%5"
        ],
    category: "food",
    state: "liquid",
    density: 820.33,
    tempHigh: 1000,
    tempLow: 0,
    stateHigh: [
          "smoke",
          "smoke",
          "smoke",
          "calcium"
        ],
    stateLow: "frozen_yogurt",
    alias: "yoghurt",
    stateLowColorMultiplier: 1.05,
    isFood: true
  },
  "frozen_yogurt": {
    color: "#e6e6e6",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 900,
    stateHighColorMultiplier: 0.955,
    isFood: true
  },
  "ice_cream": {
    color: [
          "#f7f7f7",
          "#ededed",
          "#dedede"
        ],
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1096,
    temp: 0,
    tempHigh: 15,
    stateHigh: "cream",
    stateHighColorMultiplier: 1.03,
    isFood: true
  },
  "icing": {
    color: "#EEE4CD",
    behavior: behaveSturdyPowder,
    category: "food",
    state: "solid",
    density: 1001.74,
    tempHigh: 100,
    stateHigh: "cream",
    hidden: true,
    alias: [
          "buttercream",
          "frosting"
        ],
    isFood: true
  },
  "beans": {
    color: [
          "#db1c0b",
          "#db3c0b",
          "#fa8023",
          "#ffa12e"
        ],
    behavior: behaveLiquid,
    category: "food",
    state: "liquid",
    density: 721,
    tempHigh: 350,
    stateHigh: [
          "fire",
          "fire",
          "ash"
        ],
    viscosity: 1000,
    burn: 3,
    burnTime: 500,
    burnInto: [
          "fire",
          "smoke",
          "smoke",
          "steam",
          "ash"
        ],
    isFood: true
  },
  // -------------------- SOLIDS --------------------

  "dry_ice": {
    color: "#e6e6e6",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1562,
    temp: -98.5,
    tempHigh: -78.5,
    stateHigh: "carbon_dioxide"
  },
  "nitrogen_ice": {
    color: "#e6e6e6",
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 1562,
    temp: -259.86,
    tempHigh: -209.86,
    stateHigh: "liquid_nitrogen",
    hidden: true
  },
  "particleboard": {
    color: [
          "#cca77c",
          "#ad8b63",
          "#b59d81",
          "#c7a073",
          "#c9b297"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 700,
    tempHigh: 500,
    stateHigh: [
          "ash",
          "fire",
          "fire",
          "fire"
        ],
    hidden: true,
    burn: 2,
    burnTime: 400,
    burnInto: [
          "ash",
          "fire"
        ],
    breakInto: "sawdust",
    hardness: 0.2
  },
  "skin": {
    color: [
          "#f3e7db",
          "#f7ead0",
          "#eadaba",
          "#d7bd96",
          "#a07e56",
          "#825c43",
          "#604134",
          "#3a312a"
        ],
    category: "solids",
    state: "solid",
    density: 1019.5,
    temp: 37,
    tempHigh: 200,
    tempLow: -18,
    stateHigh: [
          "cooked_meat",
          "cooked_meat",
          "cooked_meat",
          "steam"
        ],
    stateLow: "frozen_meat",
    conduct: 0.05,
    burn: 5,
    burnTime: 400,
    burnInto: "cooked_meat",
    breakInto: [
          null,
          null,
          null,
          "blood",
          "dust"
        ],
    movable: false,
    singleColor: true,
    reactions: {
      cell: { chance: 0.01 },
      acid: { elem1: "blood" },
      soap: { chance: 0.005 },
      light: { stain1: "#825043" },
      poison: { stain1: "#cc564b" },
      poison_gas: { stain1: "#cc564b" },
      infection: { stain1: "#cc564b" },
      pollen: { stain1: "#cc564b" },
      cyanide: { stain1: "#cc564b" },
      dust: { stain1: "#cc564b" },
      flea: { stain1: "#cc564b" },
      bee: { stain1: "#cc564b" },
      mushroom_spore: { stain1: "#cc564b" },
      mushroom_stalk: { stain1: "#cc564b" },
      chlorine: { stain1: "#cc564b" },
      quicklime: { stain1: "#cc564b" },
      plague: { elem1: "plague", chance: 0.01 }
    }
  },
  "hair": {
    color: [
          "#C6C3BF",
          "#EEDFC0",
          "#DAB575",
          "#BF9F6C",
          "#C67945",
          "#9B6E47",
          "#967454",
          "#945F36",
          "#4C3D2E",
          "#5A3E2D",
          "#1c1c1c",
          "#4A2227",
          "#6D342B",
          "#9D4C3B",
          "#C25E3B"
        ],
    behavior: behaveWall,
    category: "solids",
    state: "solid",
    density: 2395,
    tempHigh: 223,
    stateHigh: [
          "smoke",
          "smoke",
          "smoke",
          "ash",
          "ash",
          "stench"
        ],
    hidden: true,
    conduct: 0.05,
    burn: 15,
    burnTime: 400,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "ash",
          "ash",
          "stench"
        ],
    breakInto: [
          null,
          null,
          null,
          null,
          "dust"
        ],
    buttonColor: [
          "#C67945",
          "#1c1c1c"
        ],
    singleColor: true,
    reactions: {
      oil: { elem2: "dust", color2: "#e0e0e0", chance: 0.005 },
      nut_oil: { elem2: "dust", color2: "#e0e0e0", chance: 0.005 },
      grease: { elem2: "dust", color2: "#e0e0e0", chance: 0.005 }
    },
    onBreak: null
  },
  // -------------------- LIQUIDS --------------------

  "alcohol": {
    color: "#c9c5b1",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 785.1,
    tempHigh: 78.37,
    stateHigh: "alcohol_gas",
    tempLow: -113.88,
    burn: 100,
    burnTime: 3,
    fireColor: [
          "#80acf0",
          "#96cdfe",
          "#bee6d4"
        ],
    stain: -0.25,
    darkText: true,
    alias: "ethanol",
    reactions: {
      virus: {  },
      plague: {  },
      charcoal: { color1: "#bdbdbd", chance: 0.05 }
    },
    isFood: true
  },
  "alcohol_gas": {
    density: 1.627,
    tempHigh: 365,
    stateHigh: "fire"
  },
  // -------------------- LAND --------------------

  "basalt": {
    color: [
          "#2e2e2e",
          "#333333",
          "#3d3d3d"
        ],
    behavior: behaveSturdyPowder,
    category: "land",
    state: "solid",
    density: 3000,
    tempHigh: 1262.5,
    stateHigh: "magma",
    breakInto: "gravel",
    hardness: 0.65,
    reactions: {
      fly: { elem2: "dead_bug", chance: 0.25, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.2, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.15, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bird: { elem2: "feather", chance: 0.025, oneway: true },
      egg: { elem2: "yolk", oneway: true },
      grass: { chance: 0.005, oneway: true },
      bone: { elem2: "oil", tempMin: 300, chance: 0.005, oneway: true },
      dead_plant: { elem2: "charcoal", tempMin: 200, chance: 0.005, oneway: true },
      charcoal: { elem2: "diamond", tempMin: 800, tempMax: 900, chance: 0.005, oneway: true }
    }
  },
  "tuff": {
    color: [
          "#927659",
          "#81644B",
          "#685843",
          "#685135",
          "#644F3A"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["M2", "M1", "M2"]
    ],
    category: "land",
    state: "solid",
    density: 2605,
    tempHigh: 1080,
    stateHigh: "magma",
    breakInto: "gravel",
    hardness: 0.4,
    reactions: {
      fly: { elem2: "dead_bug", chance: 0.25, oneway: true },
      firefly: { elem2: "dead_bug", chance: 0.2, oneway: true },
      stink_bug: { elem2: "dead_bug", chance: 0.15, oneway: true },
      bee: { elem2: "dead_bug", chance: 0.1, oneway: true },
      bird: { elem2: "feather", chance: 0.025, oneway: true },
      egg: { elem2: "yolk", oneway: true },
      bone: { elem2: "oil", tempMin: 300, chance: 0.005, oneway: true },
      dead_plant: { elem2: "charcoal", tempMin: 200, chance: 0.005, oneway: true },
      charcoal: { elem2: "diamond", tempMin: 800, tempMax: 900, chance: 0.005, oneway: true }
    }
  },
  // -------------------- STATES --------------------

  "molten_tuff": {
    color: [
          "#ff932c",
          "#ff762c",
          "#ff5800"
        ],
    behavior: behaveMolten,
    category: "states",
    state: "liquid",
    density: 2725,
    temp: 1080,
    tempLow: 1000,
    stateLow: "tuff",
    hidden: true,
    viscosity: 10000
  },
  // -------------------- LIQUIDS --------------------

  "soap": {
    color: "#f2f2f2",
    behavior: [
          "XX|CR:bubble%0.25|XX",
          "M2|XX|M2",
          "M2|M1|M2"
        ],
    category: "liquids",
    state: "liquid",
    density: 1055,
    tempHigh: 100,
    stateHigh: "bubble",
    viscosity: 500,
    stain: -1,
    reactions: {
      rust: { elem2: "iron", chance: 0.01 },
      oxidized_copper: { elem2: "copper", chance: 0.01 },
      blood: { chance: 0.02 },
      dirty_water: { elem2: "water" },
      salt_water: { elem1: [
                "foam",
                "bubble"
              ], chance: 0.005 },
      oxygen: { elem2: "bubble" },
      plague: {  },
      virus: {  },
      infection: { elem2: [
                "blood",
                null
              ], chance: 0.02 },
      mushroom_spore: { chance: 0.02 },
      lichen: { chance: 0.005 },
      rotten_meat: { elem2: "meat" },
      rotten_cheese: { elem2: "cheese" },
      acid_cloud: { elem2: "rain_cloud" },
      oil: { chance: 0.02 },
      soda: { elem2: "sugar_water", chance: 0.02 },
      ink: { chance: 0.02 },
      dye: { chance: 0.02 },
      glue: { chance: 0.02 },
      slime: { chance: 0.005 },
      stench: {  },
      cancer: { chance: 0.01 },
      rat: { chance: 0.01 },
      ant: { elem2: "dead_bug", chance: 0.1 },
      bee: { elem2: "dead_bug", chance: 0.1 },
      fly: { elem2: "dead_bug", chance: 0.1 },
      firefly: { elem2: "dead_bug", chance: 0.1 },
      worm: { elem2: "dead_bug", chance: 0.1 },
      flea: { elem2: "dead_bug", chance: 0.1 },
      termite: { elem2: "dead_bug", chance: 0.1 },
      spider: { elem2: "dead_bug", chance: 0.1 },
      stink_bug: { elem2: "dead_bug", chance: 0.1 },
      smog: { elem2: "cloud" },
      water: { elem1: [
                "foam",
                "bubble"
              ], chance: 0.005 },
      sugar_water: { elem1: [
                "foam",
                "bubble"
              ], chance: 0.005 },
      seltzer: { elem1: [
                "foam",
                "bubble"
              ], chance: 0.005 },
      pool_water: { elem1: [
                "foam",
                "bubble"
              ], chance: 0.005 },
      fire: { elem1: "fragrance" }
    }
  },
  "bleach": {
    color: "#ffffff",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1210,
    tempHigh: 111,
    tempLow: -15.3,
    stateHigh: [
          "salt",
          "steam"
        ],
    viscosity: 0.956,
    stain: 0.1,
    reactions: {
      acid: { elem1: "chlorine", elem2: "neutral_acid" },
      acid_gas: { elem1: "chlorine", elem2: "chlorine" },
      acid_cloud: { elem1: "chlorine", elem2: "chlorine" },
      water: { elem2: "dirty_water" },
      plague: {  },
      cell: { chance: 0.05 },
      tadpole: { chance: 0.05 },
      cancer: { chance: 0.01 },
      fish: { elem2: "rotten_meat", chance: 0.01 },
      oil: { elem2: "chlorine", chance: 0.01 },
      lamp_oil: { elem2: "chlorine", chance: 0.01 },
      nut_oil: { elem2: "chlorine", chance: 0.01 },
      grease: { elem2: "chlorine", chance: 0.01 },
      baking_soda: { elem2: "chlorine", chance: 0.01 },
      blood: {  },
      infection: {  },
      vinegar: { elem1: "chlorine", elem2: "sodium_acetate" },
      ammonia: { elem1: "poison_gas" },
      alcohol: { elem1: "poison_gas" },
      soap: { elem1: "poison_gas", chance: 0.1 },
      poison: { elem1: "poison_gas", chance: 0.1 },
      iron: { elem2: "rust", chance: 0.1 },
      copper: { elem2: "oxidized_copper", chance: 0.1 },
      pollen: { chance: 0.1 },
      antidote: { chance: 0.1 },
      porcelain: { stain2: "#b3967f" },
      porcelain_shard: { stain2: "#b3967f" },
      salt: { elem2: "foam", chance: 0.001 }
    }
  },
  // -------------------- GASES --------------------

  "chlorine": {
    color: "#a5ac50",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 3.2,
    tempLow: -36.04,
    stateLow: "liquid_chlorine",
    stain: 0.005,
    reactions: {
      water: { elem1: "pool_water" },
      hydrogen: { elem1: "acid_gas", tempMax: 1000 },
      dirty_water: { elem2: "water" },
      ammonia: { elem1: "poison_gas" },
      liquid_ammonia: { elem1: "poison_gas" },
      oil: { elem2: "explosion", burning2: true },
      lamp_oil: { elem2: "explosion", burning2: true },
      sodium: { elem1: "fire", elem2: "salt" },
      molten_sodium: { elem1: "fire", elem2: "salt" },
      root: { chance: 0.025 },
      tree_branch: { elem2: "wood", chance: 0.015 },
      pistil: { elem2: "dead_plant", chance: 0.025 },
      head: { func: null, chance: 0.005 }
    }
  },
  // -------------------- STATES --------------------

  "liquid_chlorine": {
    color: "#f4d217",
    behavior: behaveLiquid,
    category: "states",
    state: "liquid",
    density: 1562.5,
    temp: -36.04,
    tempHigh: -34.04,
    tempLow: -101.5,
    stateHigh: "chlorine",
    hidden: true,
    stain: 0.01,
    reactions: {
      water: { elem1: "acid" },
      steam: { elem2: "acid_gas" },
      ammonia: { elem1: "poison" },
      liquid_ammonia: { elem1: "poison" }
    }
  },
  // -------------------- LIQUIDS --------------------

  "dye": {
    color: [
          "#ff0000",
          "#ff8800",
          "#ffff00",
          "#00ff00",
          "#00ffff",
          "#0000ff",
          "#ff00ff"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 998,
    tempHigh: 100,
    stateHigh: "smoke",
    stain: 0.66,
    stainSelf: true,
    darkText: true,
    customColor: true,
    reactions: {
      water: {  },
      salt_water: { chance: 0.05 },
      sugar_water: { chance: 0.05 },
      seltzer: { chance: 0.05 },
      dirty_water: { chance: 0.05 },
      pool_water: { chance: 0.05 },
      bleach: { chance: 0.05 },
      sand: {  }
    },
    isFood: true
  },
  "ink": {
    color: "#171717",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1074.3,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "smoke",
    stateLowName: "frozen_ink",
    stain: 0.66,
    canPlace: true,
    reactions: {
      water: { chance: 0.01 },
      salt_water: { chance: 0.01 },
      sugar_water: { chance: 0.01 },
      seltzer: { chance: 0.01 },
      dirty_water: { chance: 0.01 },
      pool_water: { chance: 0.01 },
      dye: { elem1: "dye", color1: "#171717" },
      bleach: { chance: 0.05 }
    }
  },
  "mercury": {
    color: [
          "#53574b",
          "#65686a"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 13545,
    tempHigh: 356.73,
    stateHigh: "mercury_gas",
    tempLow: -38.83,
    stateLow: "solid_mercury",
    stateLowName: "solid_mercury",
    conduct: 0.85,
    viscosity: 1.53,
    fireColor: "#f53500",
    reactions: {
      gold: { elem2: "amalgam", chance: 0.01 },
      zinc: { elem2: "amalgam", chance: 0.01 },
      sodium: { elem1: [
                "pop",
                "electric"
              ], elem2: "amalgam", chance: 0.01, temp2: 600 },
      molten_sodium: { elem1: [
                "pop",
                "electric"
              ], elem2: "amalgam", chance: 0.01, temp2: 600 },
      aluminum: { elem2: "amalgam", chance: 0.01 },
      tin: { elem2: "amalgam", chance: 0.01 },
      lead: { elem2: "amalgam", chance: 0.01 },
      silver: { elem2: "amalgam", chance: 0.01 },
      copper: { elem2: "amalgam", chance: 0.01 },
      gold_coin: { elem2: "amalgam", chance: 0.01 },
      rose_gold: { elem2: "amalgam", chance: 0.01 },
      water: { elem2: "dirty_water" },
      salt_water: { elem2: "dirty_water" },
      sugar_water: { elem2: "dirty_water" },
      seltzer: { elem2: "dirty_water" },
      neutron: { elem1: "gold_coin", chance: 0.005 }
    }
  },
  "mercury_gas": {
    density: 12800,
    conduct: 0.02,
    colorOn: "#5a96e0"
  },
  "solid_mercury": {
    conduct: 0.99,
    superconductAt: -269.15
  },
  "blood": {
    color: [
          "#ff0000",
          "#ee0000"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1060,
    tempHigh: 124.55,
    tempLow: 0,
    stateHigh: [
          "steam",
          "salt",
          "oxygen"
        ],
    viscosity: 10,
    stain: 0.05,
    reactions: {
      vaccine: { elem1: "antibody" },
      plague: { elem1: "infection" },
      rotten_meat: { elem1: "infection" },
      rotten_cheese: { elem1: "infection" },
      virus: { elem1: "infection" },
      cancer: { elem1: "infection" },
      cyanide: { elem1: "infection" },
      cyanide_gas: { elem1: "infection" },
      mushroom_spore: { elem1: "infection" },
      mushroom_gill: { elem1: "infection" },
      dirty_water: { elem1: "infection" },
      rad_steam: { elem1: "infection" },
      rad_glass: { elem1: "infection" },
      rad_shard: { elem1: "infection" },
      rad_cloud: { elem1: "infection" },
      fallout: { elem1: "infection" },
      rust: { elem1: "infection", chance: 0.05 },
      oxidized_copper: { elem1: "infection", chance: 0.05 },
      rat: { elem1: "infection", chance: 0.075 },
      flea: { elem1: "infection", chance: 0.03 },
      worm: { elem1: "infection", chance: 0.03 },
      mercury: { elem1: "infection", chance: 0.05 },
      lead: { elem1: "infection", chance: 0.01 },
      oxygen: { chance: 0.05 },
      carbon_dioxide: { chance: 0.05 },
      alcohol: { elem1: [
                null,
                "dna"
              ], chance: 0.02 },
      blood: { elem2: "bubble", color2: "#f07878", attr2: {
                clone: "blood"
              }, chance: 0.001, tempMin: 85 }
    }
  },
  "vaccine": {
    color: "#e0d0ad",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1125,
    tempHigh: 130,
    tempLow: -2.5,
    stateHigh: "steam",
    stateLow: [
          "ice",
          "dna"
        ],
    viscosity: 2.6,
    stain: -0.05,
    reactions: {
      infection: { elem2: "antibody", chance: 0.1 },
      antibody: { chance: 0.0025 },
      plague: { chance: 0.1 },
      virus: { chance: 0.1 },
      cancer: { chance: 0.01 },
      rotten_meat: { elem2: "meat", chance: 0.1 },
      rotten_cheese: { elem2: "cheese", chance: 0.1 }
    },
    isFood: true
  },
  "antibody": {
    color: "#ff4040",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1060,
    tempHigh: 120,
    tempLow: 0,
    stateHigh: [
          "salt",
          "oxygen",
          "vaccine"
        ],
    hidden: true,
    viscosity: 6.3,
    stain: 0.05,
    reactions: {
      blood: { elem2: "antibody", chance: 0.01 },
      infection: { elem2: "antibody", chance: 0.1 },
      cancer: { chance: 0.01 },
      worm: { chance: 0.01 },
      rotten_meat: { elem2: "meat", chance: 0.1 },
      rotten_cheese: { elem2: "cheese", chance: 0.1 },
      poison: { elem1: "antidote", chance: 0.03 },
      alcohol: { elem1: [
                null,
                "dna"
              ], chance: 0.02 },
      sugar_water: { elem1: "vaccine", elem2: "vaccine" }
    }
  },
  "infection": {
    color: [
          "#cf005d",
          "#be004c"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1060,
    tempHigh: 124.55,
    tempLow: 0,
    stateHigh: [
          "plague",
          "plague",
          "plague",
          "salt",
          "oxygen"
        ],
    hidden: true,
    viscosity: 15,
    stain: 0.05,
    reactions: {
      blood: { elem2: "infection", chance: 0.01 },
      frog: { elem2: "rotten_meat", chance: 0.005 },
      fish: { elem2: "rotten_meat", chance: 0.005 },
      meat: { elem2: "rotten_meat", chance: 0.005 },
      alcohol: { elem1: "blood", chance: 0.2 },
      epsom_salt: { elem1: "blood", chance: 0.3 }
    }
  },
  "poison": {
    color: "#00ff00",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1060,
    tempHigh: 110,
    stateHigh: "poison_gas",
    tempLow: 0,
    stateLow: "poison_ice",
    viscosity: 2,
    darkText: true,
    reactions: {
      blood: { elem2: "infection" },
      water: { elem2: "dirty_water" },
      salt_water: { elem2: "dirty_water" },
      sugar_water: { elem2: "dirty_water" },
      seltzer: { elem2: "dirty_water" },
      soap: { chance: 0.02 },
      plant: { elem2: "dead_plant" },
      evergreen: { elem2: "dead_plant" },
      cactus: { elem2: "dead_plant" },
      grass: { elem2: "dead_plant" },
      vine: { elem2: "dead_plant" },
      algae: {  },
      kelp: { elem2: "dirty_water" },
      coral: { elem2: "dirty_water", chance: 0.02 },
      mushroom_spore: { chance: 0.1 },
      lichen: {  },
      yeast: {  },
      rat: { elem2: "rotten_meat" },
      frog: { elem2: "rotten_meat" },
      tadpole: {  },
      fish: { elem2: "rotten_meat" },
      bird: { elem2: "rotten_meat" },
      head: { elem2: "rotten_meat" },
      body: { elem2: "rotten_meat" },
      homunculus: { elem2: "rotten_meat" },
      ant: { elem2: "dead_bug" },
      worm: { elem2: "dead_bug" },
      fly: { elem2: "dead_bug" },
      firefly: { elem2: "dead_bug" },
      bee: { elem2: "dead_bug" },
      stink_bug: { elem2: "dead_bug" },
      termite: { elem2: "dead_bug" },
      spider: { elem2: "dead_bug" },
      flea: { elem2: "dead_bug" },
      slug: { elem2: "slime" },
      snail: { elem2: "limestone" },
      sapling: { elem2: "dead_plant" },
      root: { elem2: "dead_plant" },
      flower_seed: { elem2: "dead_plant" },
      pistil: { elem2: "dead_plant" },
      petal: { elem2: "dead_plant" },
      grass_seed: { elem2: "dead_plant" },
      meat: { elem2: "rotten_meat" },
      cheese: { elem2: "rotten_cheese" },
      cheese_powder: { elem2: "rotten_cheese" },
      tree_branch: { elem2: "wood" },
      mushroom_cap: { chance: 0.01 },
      mushroom_gill: { chance: 0.01 },
      mushroom_stalk: { chance: 0.01 },
      hyphae: { chance: 0.02 },
      mycelium: { elem2: "dirt", chance: 0.1 },
      pollen: { chance: 0.01 },
      bone_marrow: { elem2: "rotten_meat" },
      hair: { chance: 0.01 },
      charcoal: { elem1: "dirty_water", chance: 0.02 },
      gravel: { elem1: "dirty_water", chance: 0.01 }
    }
  },
  // -------------------- GASES --------------------

  "poison_gas": {
    color: "#98f5b0",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.6,
    tempLow: 0,
    stateLow: "poison"
  },
  "poison_ice": {
    color: "#9eff9e"
  },
  "cyanide_gas": {
    color: "#8fa88f",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 941,
    tempHigh: 550,
    stateHigh: "fire",
    burn: 100,
    burnTime: 1,
    alias: "hydrogen cyanide gas",
    reactions: {
      frog: { elem2: "rotten_meat" },
      ant: {  },
      bee: {  },
      fish: { elem2: "rotten_meat" },
      firefly: {  },
      head: { elem2: "rotten_meat" },
      body: { elem2: "rotten_meat" }
    }
  },
  // -------------------- LIQUIDS --------------------

  "antidote": {
    color: "#c9b836",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1060,
    tempHigh: 124.55,
    tempLow: -2.5,
    stateHigh: [
          "steam",
          "salt",
          "oxygen"
        ],
    stateLow: [
          "salt_ice",
          "dna"
        ],
    viscosity: 2,
    stain: -0.05,
    reactions: {
      poison: { chance: 0.1 }
    }
  },
  "tea": {
    color: "#6c4317",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1001,
    temp: 70,
    tempHigh: 125,
    tempLow: 0,
    stateHigh: [
          "steam",
          "fragrance",
          null
        ],
    hidden: true,
    ignore: [
          "paper"
        ],
    stain: -0.1,
    reactions: {
      stench: {  },
      flea: { chance: 0.01 },
      oxygen: { elem2: "fragrance", chance: 0.01 },
      infection: { elem2: "blood", chance: 0.005 },
      plague: { chance: 0.004 },
      sugar: { color1: "#8f5a21", chance: 0.005 },
      honey: { color1: "#8f5a21", chance: 0.005 },
      milk: { color1: "#9c6c38", chance: 0.005 },
      nut_milk: { color1: "#9c6c38", chance: 0.005 },
      fruit_milk: { color1: "#9c5938", chance: 0.005 },
      chocolate_milk: { elem2: "foam", color1: "#784b1a", chance: 0.005 },
      pilk: { elem2: "foam", color1: "#9c7954", chance: 0.005 },
      cream: { color1: "#9c6c38", chance: 0.005 },
      ice_cream: { color1: "#9c6c38", chance: 0.005 },
      tea: { elem2: "bubble", color2: "#87633d", attr2: {
                clone: "tea"
              }, chance: 0.001, tempMin: 80 },
      paper: { stain2: "#6c4317", chance: 0.1 }
    },
    isFood: true
  },
  "coffee": {
    color: "#24100b",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1001.74,
    temp: 70,
    tempHigh: 130,
    tempLow: 0,
    stateHigh: [
          "steam",
          "fragrance",
          null
        ],
    hidden: true,
    stain: 0.01,
    reactions: {
      stench: {  },
      oxygen: { elem2: "fragrance", chance: 0.01 },
      sugar: { color1: "#99552A", chance: 0.005 },
      honey: { color1: "#99552A", chance: 0.005 },
      pumpkin_seed: { color1: "#6A2F03", chance: 0.005 },
      milk: { elem2: "foam", color1: "#CA9D68", chance: 0.005 },
      nut_milk: { elem2: "foam", color1: "#CA9D68", chance: 0.005 },
      fruit_milk: { elem2: "foam", color1: "#ca8e68", chance: 0.005 },
      chocolate_milk: { elem2: "foam", color1: "#4f3d29", chance: 0.005 },
      pilk: { elem2: "foam", color1: "#ba9c79", chance: 0.005 },
      cream: { elem2: "foam", color1: "#CA9D68", chance: 0.005 },
      ice_cream: { color1: "#CA9D68", chance: 0.005 },
      chocolate: { color1: "#6A3517", chance: 0.005 },
      chocolate_powder: { color1: "#6A3517", chance: 0.005 },
      melted_chocolate: { color1: "#6A3517", chance: 0.005 },
      water: { elem2: "coffee", tempMin: 70, chance: 0.2 },
      salt_water: { elem2: "coffee", tempMin: 70, chance: 0.2 },
      sugar_water: { elem2: "melted_chocolate", tempMin: 60, chance: 0.3 },
      seltzer: { elem2: "coffee", tempMin: 70, chance: 0.2 },
      coffee: { elem2: "bubble", color2: "#8a4d3e", attr2: {
                clone: "coffee"
              }, chance: 0.001, tempMin: 80 }
    },
    isFood: true
  },
  "honey": {
    color: [
          "#f6ce1a",
          "#e79001",
          "#bb5503"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1420,
    tempHigh: 71.11,
    tempLow: 0,
    stateHigh: "caramel",
    stateLow: "candy",
    viscosity: 10000,
    stateLowColor: [
          "#fcedac",
          "#fece80",
          "#fdbf8b"
        ],
    isFood: true
  },
  "sap": {
    color: [
          "#e4ae3a",
          "#cf7a19",
          "#c86305",
          "#b67f18"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1400,
    tempHigh: 103.05,
    tempLow: 0,
    stateHigh: [
          "sugar",
          "steam",
          "smoke",
          "smoke"
        ],
    stateLow: "amber",
    stateLowName: "amber",
    viscosity: 15,
    burn: 40,
    burnTime: 15,
    burnInto: "fire",
    reactions: {
      dead_bug: { elem1: "amber", chance: 0.1 },
      ant: { elem1: "amber", chance: 0.1 },
      fly: { elem1: "amber", chance: 0.1 },
      flea: { elem1: "amber", chance: 0.1 },
      termite: { elem1: "amber", chance: 0.1 },
      worm: { elem1: "amber", chance: 0.1 },
      bee: { elem1: "amber", chance: 0.1 },
      firefly: { elem1: "amber", chance: 0.1 },
      stink_bug: { elem1: "amber", chance: 0.1 },
      slug: { elem1: "amber", chance: 0.1 },
      snail: { elem1: "amber", chance: 0.1 },
      spider: { elem1: "amber", chance: 0.1 }
    }
  },
  "caramel": {
    color: "#e89a51",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 850,
    tempHigh: 400,
    tempLow: -20,
    stateHigh: "smoke",
    stateLow: "candy",
    viscosity: 500,
    stain: 0.01,
    reactions: {
      grape: { elem2: "jelly", chance: 0.005, tempMin: 100 },
      salt: { color1: "#ffbd80", chance: 0.005 },
      herb: { tempMax: 180, elem1: "sugar", color1: [
                "#c92626",
                "#e3e3e3",
                "#c92626",
                "#e3e3e3",
                "#c92626"
              ], chance: 0.1 }
    },
    isFood: true
  },
  "molasses": {
    color: [
          "#210c06",
          "#170804"
        ],
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1600,
    tempHigh: 1000,
    tempLow: 0,
    stateHigh: [
          "fire",
          "smoke",
          "steam"
        ],
    stateLow: "candy",
    viscosity: 7500,
    stain: 0.05,
    stateLowColor: [
          "#a43b1e",
          "#98361b"
        ],
    isFood: true
  },
  "ketchup": {
    color: "#ff3119",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1235,
    tempHigh: 260,
    stateHigh: [
          "carbon_dioxide",
          "methane",
          "steam",
          "salt",
          "sugar"
        ],
    viscosity: 50000,
    stain: 0.05,
    reactions: {
      rust: { elem2: "iron", chance: 0.01 },
      oxidized_copper: { elem2: "copper", chance: 0.01 },
      baking_soda: { elem1: "carbon_dioxide", elem2: "foam", chance: 0.01, attr2: {
                foam: 5
              } }
    },
    isFood: true
  },
  "mayo": {
    color: "#fcffbd",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 910,
    tempHigh: 100.6,
    stateHigh: [
          "steam",
          "carbon_dioxide",
          "methane"
        ],
    viscosity: 3491,
    stain: 0.01,
    alias: "mayonnaise",
    reactions: {
      glue: { chance: 0.01 },
      oil: { chance: 0.01 },
      sap: { chance: 0.01 }
    },
    isFood: true
  },
  "grease": {
    color: "#cf9251",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 919,
    temp: 45,
    tempHigh: 250,
    tempLow: 20,
    stateHigh: [
          "fire",
          "smoke",
          "smoke",
          "smoke"
        ],
    stateLow: "fat",
    stateLowName: "fat",
    hidden: true,
    viscosity: 70,
    reactions: {
      caustic_potash: { elem1: "soap", elem2: "soap" },
      toast: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      crumb: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      baked_batter: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      baked_potato: { color2: [
                "#A84B1E",
                "#C96619",
                "#F9B042"
              ], tempMin: 160, chance: 0.05 },
      yolk: { elem1: "mayo", elem2: "mayo", chance: 0.1 }
    },
    isFood: true
  },
  "fat": {
    color: "#dbc9b6",
    tempHigh: 45,
    stateHigh: "grease",
    reactions: {
      caustic_potash: { elem1: "soap" }
    }
  },
  // -------------------- STATES --------------------

  "melted_chocolate": {
    color: "#3b160b",
    behavior: behaveLiquid,
    category: "states",
    state: "liquid",
    density: 1325,
    tempHigh: 99,
    tempLow: 0,
    stateHigh: [
          "steam",
          "sugar"
        ],
    stateLow: "chocolate",
    hidden: true,
    viscosity: 40,
    stain: 0.05,
    isFood: true
  },
  // -------------------- LIQUIDS --------------------

  "liquid_hydrogen": {
    color: "#97afcf",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 71,
    temp: -255.879,
    tempHigh: -252.879,
    tempLow: -259.2,
    stateHigh: "hydrogen",
    burn: 100,
    burnTime: 2,
    darkText: true,
    reactions: {
      liquid_oxygen: { elem1: "ice" },
      oxygen: { elem1: "ice" }
    }
  },
  "liquid_oxygen": {
    color: "#00ad99",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 1141,
    temp: -190,
    tempHigh: -182.962,
    tempLow: -218.8,
    stateHigh: "oxygen",
    hidden: true,
    burn: 100,
    burnTime: 2,
    reactions: {
      hydrogen: { elem1: "ice" }
    }
  },
  "liquid_nitrogen": {
    color: "#d3e1e3",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 804,
    temp: -209.86,
    tempHigh: -195.795,
    tempLow: -259.86,
    stateHigh: "nitrogen",
    stateLow: "nitrogen_ice",
    alias: "ln2"
  },
  // -------------------- STATES --------------------

  "liquid_helium": {
    color: "#e3d3d3",
    behavior: behaveSuperfluid,
    category: "states",
    state: "liquid",
    density: 145,
    temp: -269,
    tempHigh: -268.95,
    stateHigh: "helium",
    hidden: true,
    viscosity: 0
  },
  // -------------------- POWDERS --------------------

  "sodium": {
    color: [
          "#484849",
          "#5d5e5f",
          "#6b6968",
          "#747775"
        ],
    category: "powders",
    state: "solid",
    density: 968,
    tempHigh: 97.794,
    conduct: 0.85,
    hardness: 0.05,
    reactions: {
      chlorine: { elem1: "salt", elem2: "pop" },
      vinegar: { elem1: "sodium_acetate", elem2: [
                null,
                null,
                null,
                "hydrogen"
              ], attr1: {
                foam: 15
              } },
      water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      salt_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      sugar_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      dirty_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      seltzer: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      pool_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      primordial_soup: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      nut_milk: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 200 },
      acid: { elem1: [
                "hydrogen",
                "salt",
                "salt",
                "pop"
              ], elem2: [
                "hydrogen",
                "salt",
                "salt",
                "pop"
              ], temp1: 100, temp2: 100 }
    }
  },
  "molten_sodium": {
    density: 927,
    tempHigh: 882.8,
    tempLow: 97.794,
    fireColor: "#ffff00",
    reactions: {
      chlorine: { elem1: "salt", elem2: "pop" },
      vinegar: { elem1: "sodium_acetate", attr1: {
                foam: 15
              } },
      water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      salt_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      sugar_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      dirty_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      seltzer: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      pool_water: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      primordial_soup: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      nut_milk: { elem1: [
                "pop",
                "pop",
                "pop",
                "hydrogen",
                "lye"
              ], chance: 0.01, temp2: 250 },
      acid: { elem1: "explosion" },
      molten_potassium_salt: { elem1: "salt", elem2: "potassium" }
    }
  },
  "sodium_gas": {
    color: "#5d5e5f"
  },
  "calcium": {
    color: [
          "#544E45",
          "#6A635E",
          "#6E6A61",
          "#756F62",
          "#918A7B"
        ],
    category: "powders",
    state: "solid",
    density: 1550,
    tempHigh: 842,
    conduct: 0.4,
    fireColor: "#ff6b21",
    hardness: 0.2,
    reactions: {
      oxygen: { elem1: "quicklime" },
      water: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      salt_water: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      sugar_water: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      dirty_water: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      seltzer: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      pool_water: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      nut_milk: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 },
      steam: { elem1: [
                "slaked_lime",
                "pop"
              ], elem2: [
                "hydrogen",
                "bubble"
              ], chance: 0.005, temp2: 350 }
    }
  },
  "molten_calcium": {
    density: 1378,
    burn: 10,
    burnInto: [
          "flash",
          "smoke",
          "pop"
        ]
  },
  // -------------------- LAND --------------------

  "limestone": {
    color: [
          "#fcfaeb",
          "#f8f1db",
          "#d9ccb2",
          "#c5b79c"
        ],
    behavior: behaveSturdyPowder,
    category: "land",
    state: "solid",
    density: 2100,
    tempHigh: 825,
    stateHigh: [
          "quicklime",
          "quicklime",
          "quicklime",
          "quicklime",
          "quicklime",
          "quicklime",
          "carbon_dioxide"
        ],
    breakInto: [
          "quicklime",
          "dust",
          "gravel"
        ],
    hardness: 0.3,
    alias: "calcium carbonate"
  },
  "quicklime": {
    color: "#e9ebe7",
    behavior: behavePowder,
    category: "land",
    state: "solid",
    density: 1025,
    tempHigh: 2613,
    stateHigh: "molten_calcium",
    hidden: true,
    hardness: 0.23,
    alias: "calcium oxide",
    reactions: {
      water: { elem1: "slaked_lime", elem2: "slaked_lime", temp2: 300, temp1: 300, chance: 0.05 },
      salt_water: { elem1: "slaked_lime", elem2: "slaked_lime", temp2: 300, temp1: 300, chance: 0.1 },
      carbon_dioxide: { elem1: "limestone", chance: 0.1, tempMax: 200 },
      ant: { elem2: "dead_bug", chance: 0.2 },
      fly: { elem2: "dead_bug", chance: 0.2 },
      firefly: { elem2: "dead_bug", chance: 0.2 },
      bee: { elem2: "dead_bug", chance: 0.2 },
      stink_bug: { elem2: "dead_bug", chance: 0.2 },
      termite: { elem2: "dead_bug", chance: 0.2 },
      flea: { elem2: "dead_bug", chance: 0.2 }
    }
  },
  "slaked_lime": {
    color: "#A8A19D",
    behavior: behaveSturdyPowder,
    category: "land",
    state: "solid",
    density: 2211,
    tempHigh: 580,
    stateHigh: "quicklime",
    hidden: true,
    hardness: 0.13,
    alias: "calcium hydroxide",
    reactions: {
      wet_sand: { elem1: "cement", chance: 0.2 },
      sand: { elem1: "cement", chance: 0.2 },
      ash: { elem1: "cement", chance: 0.2 },
      clay_shard: { elem1: "cement", chance: 0.2 },
      porcelain_shard: { elem1: "cement", chance: 0.2 },
      milk: { elem1: "glue", elem2: "glue", chance: 0.02 },
      seltzer: { elem1: "limestone", elem2: "water", chance: 0.02 },
      carbon_dioxide: { elem1: "limestone", chance: 0.02 }
    }
  },
  // -------------------- POWDERS --------------------

  "potassium": {
    color: [
          "#C9CFCD",
          "#B4BDBA",
          "#98A1A0",
          "#7C8486",
          "#636B6E"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 890,
    tempHigh: 63.5,
    conduct: 0.75,
    burn: 20,
    fireColor: "#C291FE",
    hardness: 0.5,
    reactions: {
      chlorine: { elem1: "potassium_salt", elem2: [
                "fire",
                "pop"
              ], chance: 0.05 },
      water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      steam: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      smog: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      salt_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      sugar_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      dirty_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      seltzer: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      pool_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      nut_milk: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      electric: { elem1: [
                null,
                "pop"
              ], elem2: [
                "pop",
                "fire"
              ], chance: 0.05, temp2: 400 }
    }
  },
  "molten_potassium": {
    color: "#4B3C3B",
    tempHigh: 757.6,
    tempLow: 63.5,
    stateLow: "potassium",
    burn: 20,
    burnInto: [
          "caustic_potash",
          "pop"
        ],
    reactions: {
      chlorine: { elem1: "potassium_salt", elem2: [
                "fire",
                "pop"
              ], chance: 0.05 },
      water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      steam: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      salt_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      sugar_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      dirty_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      seltzer: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      pool_water: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 },
      nut_milk: { elem1: [
                "caustic_potash",
                "pop"
              ], elem2: [
                "hydrogen",
                "pop",
                "fire"
              ], chance: 0.01, temp2: 400 }
    }
  },
  "potassium_gas": {
    color: "#827271"
  },
  "magnesium": {
    color: [
          "#D0D0D0",
          "#A8A8A8",
          "#ADADAD"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 890,
    tempHigh: 650,
    conduct: 0.05,
    burn: 20,
    fireColor: "#f9ebff",
    fireElement: "flash",
    hardness: 0.5,
    reactions: {
      water: { elem2: "hydrogen", chance: 0.01 },
      steam: { elem2: "hydrogen", chance: 0.05 },
      salt_water: { elem2: "hydrogen", chance: 0.01 },
      sugar_water: { elem2: "hydrogen", chance: 0.01 },
      dirty_water: { elem2: "hydrogen", chance: 0.01 },
      seltzer: { elem2: "hydrogen", chance: 0.01 },
      pool_water: { elem2: "hydrogen", chance: 0.01 },
      nut_milk: { elem2: "hydrogen", chance: 0.01 }
    }
  },
  "molten_magnesium": {
    color: "#768487",
    burnInto: "flash",
    fireElement: "flash",
    reactions: {
      water: { elem2: "hydrogen", chance: 0.03 },
      steam: { elem2: "hydrogen", chance: 0.05 },
      salt_water: { elem2: "hydrogen", chance: 0.03 },
      sugar_water: { elem2: "hydrogen", chance: 0.03 },
      dirty_water: { elem2: "hydrogen", chance: 0.03 },
      seltzer: { elem2: "hydrogen", chance: 0.03 },
      pool_water: { elem2: "hydrogen", chance: 0.03 },
      nut_milk: { elem2: "hydrogen", chance: 0.03 }
    }
  },
  "lye": {
    color: "#c5d3eb",
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2130,
    tempHigh: 323,
    alias: [
          "sodium hydroxide",
          "caustic soda"
        ],
    reactions: {
      nut_oil: { elem1: "soap", chance: 0.03 },
      grease: { elem1: "soap", chance: 0.03 },
      fat: { elem1: "soap", chance: 0.005 },
      chlorine: { elem1: "bleach", chance: 0.03 },
      sodium_acetate: { elem1: "methane", chance: 0.005 },
      acid: { elem1: "salt_water", chance: 0.005, temp1: 500 },
      aluminum: { elem1: "hydrogen", chance: 0.002 },
      lead: { elem1: "hydrogen", chance: 0.005 },
      molten_lead: { elem1: "hydrogen", chance: 0.002 },
      molten_tin: { elem1: "hydrogen", chance: 0.002 },
      tin: { elem1: "hydrogen", chance: 0.002 },
      zinc: { elem1: "hydrogen", chance: 0.002 },
      galvanized_steel: { elem1: "hydrogen", elem2: "steel", chance: 0.005 },
      water: { elem1: "bubble", chance: 0.01, temp2: 250 },
      salt_water: { elem1: "bubble", chance: 0.01, temp2: 250 },
      sugar_water: { elem1: "bubble", chance: 0.01, temp2: 250 },
      dirty_water: { elem1: "bubble", chance: 0.01, temp2: 250 },
      seltzer: { elem1: "bubble", chance: 0.01, temp2: 250 },
      pool_water: { elem1: "bubble", chance: 0.01, temp2: 250 },
      primordial_soup: { elem1: "bubble", chance: 0.01, temp2: 250 },
      nut_milk: { elem1: "bubble", chance: 0.01, temp2: 250 },
      carbon_dioxide: { elem1: "baking_soda", chance: 0.02 }
    },
    grain: 4
  },
  "molten_lye": {
    color: "#976c30",
    behavior: behaveLiquid,
    tempHigh: 1388,
    stateHigh: "smoke",
    reactions: {
      acid_gas: { elem1: [
                "steam",
                "salt"
              ], chance: 0.01 },
      aluminum: { elem1: "hydrogen", chance: 0.002 },
      molten_aluminum: { elem1: "hydrogen", chance: 0.005 },
      molten_lead: { elem1: "hydrogen", chance: 0.005 },
      molten_tin: { elem1: "hydrogen", chance: 0.005 },
      molten_zinc: { elem1: "hydrogen", chance: 0.005 },
      molten_galvanized_steel: { elem1: "hydrogen", elem2: "molten_steel", chance: 0.01 }
    }
  },
  "thermite": {
    color: [
          "#5d4947",
          "#5b3c42",
          "#372a2d"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 700,
    tempHigh: 660,
    burn: 100,
    burnTime: 1000,
    hardness: 0.325
  },
  "molten_thermite": {
    burnInto: [
          null,
          null,
          null,
          null,
          "molten_iron"
        ],
    reactions: {
      ice: { elem1: "explosion" }
    }
  },
  "slag": {
    color: [
          "#4b3a2d",
          "#6a5447",
          "#6b5b53",
          "#675851",
          "#78756e"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2400,
    tempHigh: 1380,
    conduct: 0.03,
    breakInto: "gravel",
    hardness: 0.5
  },
  "amalgam": {
    color: [
          "#6b5535",
          "#96784f",
          "#604928",
          "#a69070"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "powders",
    state: "solid",
    density: 13920,
    tempHigh: 223,
    hidden: true,
    conduct: 0.37,
    hardness: 0.1,
    reactions: {
      salt_water: { elem1: "mercury", elem2: [
                "sodium",
                "hydrogen",
                "hydrogen"
              ], charged: true, chance: 0.01 }
    }
  },
  "molten_aluminum": {
    color: [
          "#e6e0db",
          "#d0d7cb",
          "#d3d2d5"
        ],
    density: 2375,
    reactions: {
      rust: { elem2: "thermite" },
      oxidized_copper: { elem2: "thermite" }
    }
  },
  "molten_zinc": {
    density: 6570,
    reactions: {
      rust: { elem2: "thermite" },
      oxidized_copper: { elem2: "thermite" },
      steel: { elem2: "galvanized_steel" },
      molten_steel: { elem2: "molten_galvanized_steel" }
    }
  },
  // -------------------- GASES --------------------

  "neon": {
    color: "#bababa",
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 0.9002,
    tempLow: -246,
    stateLow: "liquid_neon",
    conduct: 0.86,
    colorOn: [
          "#ff0000",
          "#d01822",
          "#fe5c0c"
        ]
  },
  // -------------------- STATES --------------------

  "liquid_neon": {
    color: "#d1d1d1",
    behavior: behaveLiquid,
    category: "states",
    state: "liquid",
    density: 1207,
    temp: -247,
    tempHigh: -246,
    tempLow: -248.6,
    stateHigh: "neon",
    hidden: true,
    conduct: 0.83,
    colorOn: [
          "#ff0000",
          "#d01822",
          "#fe5c0c"
        ]
  },
  // -------------------- GASES --------------------

  "smog": {
    color: "#989398",
    behavior: [
          "XX|M2%5|XX",
          "M1%8|XX|M1%8",
          "XX|M2%5|XX"
        ],
    category: "gases",
    state: "gas",
    density: 590.3,
    temp: 100,
    tempLow: 47.5,
    stateLow: "dirty_water",
    conduct: 0.03,
    breakInto: "dirty_water",
    stain: 0.0035,
    reactions: {
      plant: { elem1: "cloud" },
      evergreen: { elem1: "cloud" },
      cactus: { elem1: "cloud" },
      algae: { elem1: "cloud" },
      kelp: { elem1: "cloud" }
    }
  },
  "stench": {
    color: "#6ab066",
    behavior: [
          "M2|M1|M2",
          "M1|DL%0.5|M1",
          "M2|M1|M2"
        ],
    category: "gases",
    state: "gas",
    density: 1.293,
    tempHigh: 1000,
    tempLow: -15,
    stateHigh: "fire",
    stateLow: "liquid_stench",
    reactions: {
      oxygen: { elem2: "stench", chance: 0.01 },
      water: { elem2: "dirty_water" },
      nitrogen: { elem2: "stench" }
    }
  },
  "liquid_stench": {
    color: "#3ea346"
  },
  "fragrance": {
    color: "#967bb6",
    behavior: [
          "M2|M1|M2",
          "M1|DL%0.5|M1",
          "M2|M1|M2"
        ],
    category: "gases",
    state: "gas",
    density: 1.292,
    tempHigh: 1000,
    tempLow: -15,
    stateHigh: "fire",
    stateLow: "perfume",
    reactions: {
      oxygen: { elem2: "fragrance", chance: 0.01 },
      dirty_water: { elem2: "water" }
    }
  },
  // -------------------- LIQUIDS --------------------
  
  "perfume": {
    color: "#9656e3",
    behavior: behaveLiquid,
    state: "liquid",
    category: "liquids",
    density: 1000,
    tempHigh: 40,
    stateHigh: "fragrance",
    reactions: {
    }
  },
  "cyanide": {
    color: "#b6ccb6",
    behavior: behaveLiquid,
    category: "liquids",
    state: "liquid",
    density: 687,
    tempHigh: 26,
    stateHigh: "cyanide_gas",
    tempLow: -13.29,
    hidden: true,
    burn: 100,
    burnTime: 1,
    alias: "hydrogen cyanide",
    reactions: {
      frog: { elem2: "rotten_meat" },
      ant: {  },
      bee: {  },
      fish: { elem2: "rotten_meat" },
      firefly: {  },
      head: { elem2: "rotten_meat" },
      body: { elem2: "rotten_meat" }
    }
  },
  // -------------------- GASES --------------------

  "ozone": {
    color: "#80a4ff",
    behavior: [
          "XX|XX|XX",
          "M1%7|XX|M1%7",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 2.14,
    temp: -15,
    tempLow: -112,
    stain: -0.1,
    reactions: {
      carbon_dioxide: { chance: 0.05 },
      anesthesia: { chance: 0.05 },
      copper: { elem1: "oxygen", elem2: "oxidized_copper", chance: 0.1 },
      bronze: { elem1: "oxygen", elem2: "oxidized_copper", chance: 0.05 },
      iron: { elem1: "oxygen", elem2: "rust", chance: 0.05 },
      steel: { elem1: "oxygen", elem2: "rust", chance: 0.04 },
      charcoal: { elem1: "oxygen", elem2: "carbon_dioxide", chance: 0.025 },
      dirty_water: { elem2: "water" },
      stench: {  },
      pyrocumulus: {  },
      smoke: { chance: 0.005 },
      yeast: { chance: 0.1 },
      cell: { chance: 0.1 },
      cancer: { chance: 0.025 },
      rat: { elem2: "rotten_meat", chance: 0.05 },
      fish: { elem2: "rotten_meat", chance: 0.05 },
      worm: { chance: 0.05 },
      frozen_worm: { chance: 0.05 },
      frog: { chance: 0.05 },
      plague: { chance: 0.05 },
      infection: { elem2: "blood", chance: 0.5 },
      chlorine: { chance: 0.05 },
      plant: { elem2: "dead_plant", chance: 0.25 },
      evergreen: { elem2: "dead_plant", chance: 0.25 },
      cactus: { elem2: "dead_plant", chance: 0.2 },
      grass: { elem2: "dead_plant", chance: 0.25 },
      vine: { elem2: "dead_plant", chance: 0.25 },
      tree_branch: { elem2: "wood", chance: 0.25 },
      algae: { chance: 0.25 },
      kelp: { elem2: "water", chance: 0.25 },
      proton: { elem1: "flash", color1: "#e36d88", attr1: {
                delay: 500
              }, elem2: "flash", color2: "#e36d88", attr2: {
                delay: 500
              }, chance: 0.25, y: [
                0,
                10
              ] }
    }
  },
  "liquid_ozone": {
    tempHigh: -100,
    stateHigh: "ozone",
    conduct: 1,
    burn: 100,
    burnTime: 1,
    burnInto: "explosion",
    breakInto: "explosion",
    behaviorOn: [
          "XX|XX|XX",
          "XX|CH:explosion|XX",
          "XX|XX|XX"
        ],
    extraTempHigh: {
          "0": "explosion"
        }
  },
  "cloud": {
    color: "#d5dce6",
    behavior: [
          "XX|XX|XX",
          "XX|CO:1%5|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.4,
    temp: 110,
    tempLow: 100,
    stateLow: "rain_cloud",
    conduct: 0.03,
    breakInto: "rain_cloud",
    ignoreAir: true,
    reactions: {
      rain_cloud: { elem1: "rain_cloud", temp1: -20 },
      electric: { elem1: "rain_cloud", temp1: -20 },
      cloud: { elem1: "rain_cloud", elem2: "rain_cloud", temp1: -20, temp2: -20, charged: true },
      anesthesia: { elem1: "acid_cloud", chance: 0.05 },
      sand: { elem2: "sandstorm", chance: 0.2, y: [
                0,
                12
              ], setting: "clouds" }
    }
  },
  "rain_cloud": {
    color: "#636b78",
    behavior: [
          "XX|XX|XX",
          "XX|CH:water%0.05|M1%2.5 AND BO",
          "CR:electric%0.05|CR:electric%0.05|CR:electric%0.05"
        ],
    category: "gases",
    state: "gas",
    density: 0.5,
    temp: 70,
    tempHigh: 100,
    tempLow: 0,
    stateHigh: "cloud",
    stateLow: "snow_cloud",
    conduct: 0.03,
    breakInto: "water",
    ignoreAir: true,
    reactions: {
      anesthesia: { elem1: "acid_cloud", chance: 0.05 },
      sand: { elem2: "sandstorm", chance: 0.2, y: [
                0,
                12
              ], setting: "clouds" },
      wet_sand: { elem2: "sandstorm", chance: 0.2, y: [
                0,
                12
              ], setting: "clouds" }
    }
  },
  "snow_cloud": {
    color: "#7e8691",
    behavior: [
          "XX|XX|XX",
          "XX|CH:snow%0.05|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.55,
    temp: -10,
    tempHigh: 30,
    tempLow: -200,
    stateHigh: "rain_cloud",
    stateLow: "hail_cloud",
    conduct: 0.01,
    breakInto: "snow",
    ignoreAir: true
  },
  "hail_cloud": {
    color: "#7e8691",
    behavior: [
          "XX|XX|XX",
          "XX|CH:hail%0.05|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.6,
    temp: -200,
    tempHigh: -160,
    stateHigh: "snow_cloud",
    conduct: 0.01,
    breakInto: "hail",
    ignoreAir: true
  },
  "thunder_cloud": {
    color: "#494f5b",
    behavior: [
          "XX|XX|XX",
          "XX|CH:lightning%0.001 AND CH:water%0.05|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.55,
    temp: 70,
    tempLow: 0,
    stateLow: "snow_cloud",
    conduct: 0.03,
    breakInto: "rain_cloud",
    ignoreAir: true
  },
  "acid_cloud": {
    color: "#637865",
    behavior: [
          "XX|XX|XX",
          "XX|XX|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.7,
    burn: 15,
    burnTime: 5,
    breakInto: "acid",
    ignoreAir: true,
    reactions: {
      ash: { elem1: "rain_cloud", chance: 0.05 },
      limestone: { elem1: "rain_cloud", chance: 0.05 },
      quicklime: { elem1: "rain_cloud", chance: 0.05 },
      slaked_lime: { elem1: "rain_cloud", chance: 0.05 },
      borax: { elem1: "rain_cloud", chance: 0.05 },
      ammonia: { elem1: "rain_cloud", chance: 0.05 },
      bleach: { elem1: "rain_cloud", chance: 0.05 }
    }
  },
  "sandstorm": {
    color: "#c2b576",
    behavior: [
          "XX|XX|XX",
          "XX|CH:sand%0.075|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.8,
    hidden: true,
    breakInto: "sand",
    ignoreAir: true,
    reactions: {
      sand: { elem2: "sandstorm", chance: 0.2, y: [
                0,
                12
              ], setting: "clouds" }
    }
  },
  "pyrocumulus": {
    color: "#2e2e2e",
    behavior: [
          "XX|XX|XX",
          "XX|CH:ash%0.075|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.7,
    hidden: true,
    breakInto: "ash",
    ignoreAir: true,
    reactions: {
      fireball: { elem2: "fire_cloud", chance: 0.25 }
    }
  },
  "fire_cloud": {
    color: [
          "#332424",
          "#473431",
          "#473931"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|CH:fireball%0.02|M1%2.5 AND BO",
          "XX|XX|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.8,
    temp: 500,
    tempLow: 100,
    stateLow: "pyrocumulus",
    breakInto: [
          "ash",
          "ash",
          "fireball"
        ],
    excludeRandom: true,
    ignoreAir: true,
    reactions: {
      rain_cloud: { elem1: "pyrocumulus", elem2: "pyrocumulus" },
      snow_cloud: { elem1: "pyrocumulus", elem2: "rain_cloud" },
      hail_cloud: { elem1: "pyrocumulus", elem2: "snow_cloud" },
      thunder_cloud: { elem1: "pyrocumulus", elem2: "pyrocumulus" },
      acid_cloud: { elem1: "fire", elem2: "electric" }
    }
  },
  "rad_cloud": {
    color: [
          "#2d7528",
          "#557528"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|CH:fallout,radiation%0.025|M1%2.5 AND BO",
          "CR:radiation%0.05|CR:radiation%0.05|CR:radiation%0.05"
        ],
    category: "gases",
    state: "gas",
    density: 0.5,
    hidden: true,
    ignoreAir: true
  },
  "rad_steam": {
    color: "#abffe4",
    behavior: [
          "XX|XX|XX",
          "M2%10|XX|M2%10",
          "XX|M2%10|XX"
        ],
    category: "gases",
    state: "gas",
    density: 0.7,
    tempLow: 10,
    stateLow: "fallout",
    hidden: true,
    breakInto: [
          "fallout",
          "radiation",
          "radiation"
        ],
    reactions: {
      rad_steam: { elem2: "rad_cloud", chance: 0.3, y: [
                0,
                15
              ], setting: "clouds" },
      steam: { elem2: "rad_cloud", chance: 0.3, y: [
                0,
                12
              ], setting: "clouds" },
      cloud: { elem1: "rad_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      rain_cloud: { elem1: "rad_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      snow_cloud: { elem1: "rad_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      hail_cloud: { elem1: "rad_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      thunder_cloud: { elem1: "rad_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      pyrocumulus: { elem1: "rad_cloud", chance: 0.4, y: [
                0,
                12
              ], setting: "clouds" },
      rad_cloud: { elem1: "rad_cloud", chance: 0.3, y: [
                0,
                12
              ], setting: "clouds" }
    }
  },
  "color_smoke": {
    color: [
          "#6b2e2e",
          "#6b4f2e",
          "#6b6b2e",
          "#2e6b2e",
          "#2e6b6b",
          "#2e2e6b",
          "#6b2e6b"
        ],
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.977,
    customColor: true
  },
  "spray_paint": {
    color: [
          "#ff0000",
          "#ff8800",
          "#ffff00",
          "#00ff00",
          "#00ffff",
          "#0000ff",
          "#ff00ff"
        ],
    behavior: behaveGas,
    category: "gases",
    state: "gas",
    density: 1.977,
    burn: 100,
    burnTime: 1,
    stain: 0.25,
    darkText: true,
    customColor: true
  },
  // -------------------- MACHINES --------------------

  "portal_in": {
    color: "#ff9a00",
    category: "machines",
    conduct: 1,
    hardness: 1,
    insulate: true,
    movable: false,
    ignore: [
          "fuse"
        ],
    properties: {
          channel: 0
        },
    alias: "portal",
    grain: 0,
    emit: true
  },
  "portal_out": {
    color: "#00a2ff",
    category: "machines",
    conduct: 1,
    hardness: 1,
    insulate: true,
    movable: false,
    properties: {
          channel: 0
        },
    grain: 0,
    emit: true
  },
  "led": {
    color: "#ff0000",
    behavior: behaveWall,
    category: "machines",
    tempHigh: 1500,
    stateHigh: [
          "molten_glass",
          "molten_glass",
          "molten_glass",
          "molten_gallium"
        ],
    conduct: 1,
    breakInto: "glass_shard",
    customColor: true,
    buttonColor: [
          "#660000",
          "#660000",
          "#006600",
          "#006600",
          "#000066",
          "#000066"
        ],
    forceSaveColor: true,
    reactions: {
      light: { charge1: 1 },
      liquid_light: { charge1: 1 }
    }
  },
  "light_bulb": {
    color: "#ebebc3",
    behavior: behaveWall,
    category: "machines",
    tempHigh: 1500,
    stateHigh: [
          "molten_glass",
          "molten_glass",
          "molten_copper"
        ],
    conduct: 1,
    breakInto: "glass_shard",
    behaviorOn: [
          "XX|CR:light|XX",
          "CR:light|XX|CR:light",
          "XX|CR:light|XX"
        ],
    buttonColor: "#a8a897",
    forceSaveColor: true
  },
  // -------------------- POWDERS --------------------

  "sulfur": {
    color: [
          "#EFF4AA",
          "#eaf277"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2070,
    tempHigh: 115.21,
    burn: 25,
    burnTime: 207,
    fireColor: [
          "#8180cc",
          "#7f84e6"
        ],
    darkText: true,
    alias: "sulphur",
    reactions: {
      hydrogen: { elem2: "stench" },
      silver: { stain2: "#251d0e", chance: 0.005 }
    }
  },
  "molten_sulfur": {
    color: "#831502",
    behavior: behaveLiquid,
    density: 1819,
    tempHigh: 444.6,
    tempLow: 115.21,
    stateLow: "sulfur",
    viscosity: 8.5,
    burn: 25,
    burnTime: 507,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "stench"
        ],
    fireColor: [
          "#8180cc",
          "#7f84e6"
        ],
    alias: "molten sulphur",
    reactions: {
      iron: { elem2: "pyrite" },
      magnesium: { elem2: "epsom_salt", chance: 0.01 },
      molten_magnesium: { elem2: "epsom_salt" },
      silver: { stain2: "#251d0e", chance: 0.01 }
    }
  },
  "sulfur_gas": {
    color: "#b0a65d",
    density: 2.16,
    burnTime: 10,
    burnInto: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "stench"
        ],
    reactions: {
      molten_magnesium: { elem2: "epsom_salt" },
      silver: { stain2: "#251d0e", chance: 0.0075 }
    }
  },
  "copper_sulfate": {
    color: [
          "#4391fd",
          "#004cfe"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 3600,
    tempHigh: 110,
    hidden: true,
    fireColor: [
          "#91d106",
          "#feff97",
          "#248e01"
        ],
    reactions: {
      ant: { elem2: "dead_bug" },
      fly: { elem2: "dead_bug" },
      firefly: { elem2: "dead_bug" },
      stink_bug: { elem2: "dead_bug" },
      bee: { elem2: "dead_bug" },
      termite: { elem2: "dead_bug" },
      spider: { elem2: "dead_bug" },
      plant: { elem2: "dead_plant" },
      grass: { elem2: "dead_plant" },
      algae: {  },
      kelp: { elem2: "water" },
      coral: { elem2: "water" },
      mushroom_cap: {  },
      mushroom_stalk: {  },
      mushroom_gill: {  },
      mushroom_spore: {  },
      zinc: { stain2: "#2A1210" },
      fire: { elem2: "poison_gas", chance: 0.1 },
      sugar: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      sugar_water: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      caramel: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      candy: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      flour: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      chocolate: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      soda: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      chocolate_powder: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      chocolate_milk: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      juice: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      fruit_milk: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] },
      ice_cream: { elem1: "oxidized_copper", color1: [
                "#CB3D3D",
                "#A6292B",
                "#6E1B1B"
              ] }
    }
  },
  // -------------------- SPECIAL --------------------

  "snake": {
    color: "#00bf00",
    behavior: [
          "XX|XX|XX",
          "XX|LB:plant AND RT%5|M1 AND BO:1,2,3",
          "XX|XX|XX"
        ],
    category: "special",
    rotatable: true,
    excludeRandom: true,
    reactions: {
      rat: {  },
      bird: {  },
      egg: {  }
    }
  },
  "loopy": {
    color: "#eb3474",
    behavior: [
          "XX|M2|M1",
          "XX|RT%20|M2",
          "CF|XX|XX"
        ],
    category: "special",
    ignore: [
          "cloner",
          "slow_cloner",
          "clone_powder",
          "floating_cloner",
          "ecloner"
        ],
    rotatable: true,
    onClicked: null
  },
  "warp": {
    color: "#111111",
    behavior: [
          "XX|M1 AND SW%33|XX",
          "M1 AND SW%33|XX|M1 AND SW%33",
          "XX|M1 AND SW%33|XX"
        ],
    category: "special"
  },
  "midas_touch": {
    color: [
          "#ffdf5e",
          "#ffe682"
        ],
    behavior: behaveLiquid,
    category: "special",
    state: "liquid",
    density: 193,
    canPlace: true,
    excludeRandom: true,
    reactions: {
      gold: {},
      gold_coin: {},
      rose_gold: {},
      blue_gold: {},
      purple_gold: {},
      electrum: {},
      molten_gold: {},
      pipe: {},
      paper: { stain2: "#54803d" },
      head: { elem2: "gold" },
      body: { elem2: "gold" },
      copper: { elem2: "rose_gold" },
      gallium: { elem2: "blue_gold" },
      molten_gallium: { elem2: "blue_gold" },
      aluminum: { elem2: "purple_gold" },
      silver: { elem2: "electrum" }
    }
  },
  // -------------------- ENERGY --------------------

  "radiation": {
    color: [
          "#00ff00",
          "#6fff00"
        ],
    behavior: [
          "XX|M1%0.5 AND HT|XX",
          "M1%7 AND HT|DL%3|M1%7 AND HT",
          "XX|M1%1 AND HT|XX"
        ],
    category: "energy",
    state: "gas",
    density: 1.5,
    darkText: true,
    reactions: {
      water: { elem2: "rad_steam", chance: 0.4 },
      steam: { elem2: "rad_steam", chance: 0.4 },
      salt_water: { elem2: "rad_steam", chance: 0.4 },
      sugar_water: { elem2: "rad_steam", chance: 0.4 },
      dirty_water: { elem2: "rad_steam", chance: 0.4 },
      seltzer: { elem2: "rad_steam", chance: 0.3 },
      pool_water: { elem2: "rad_steam", chance: 0.2 },
      ice: { elem2: "rad_steam", chance: 0.4 },
      salt_ice: { elem2: "dirty_ice", chance: 0.5 },
      soda: { elem2: "rad_steam", chance: 0.25 },
      juice: { elem2: "rad_steam", chance: 0.25 },
      broth: { elem2: "rad_steam", chance: 0.3 },
      tea: { elem2: "rad_steam", chance: 0.25 },
      coffee: { elem2: "rad_steam", chance: 0.25 },
      batter: { elem2: [
                "baked_batter",
                "rad_steam"
              ], chance: 0.5 },
      bubble: { elem2: "rad_steam", chance: 0.4 },
      foam: { elem2: "rad_steam", chance: 0.4 },
      rime: { elem2: "rad_steam", chance: 0.4 },
      snow: { elem2: "rad_steam", chance: 0.4 },
      packed_snow: { elem2: "rad_steam", chance: 0.4 },
      slime: { elem2: "rad_steam", chance: 0.4 },
      permafrost: { elem1: "rad_steam", elem2: "dirt", chance: 0.4 },
      mud: { elem1: "rad_steam", elem2: "dirt", chance: 0.4 },
      wet_sand: { elem1: "rad_steam", elem2: "sand", chance: 0.4 },
      clay: { elem1: "rad_steam", elem2: "clay_soil", chance: 0.4 },
      slaked_lime: { elem1: "rad_steam", elem2: "limestone", chance: 0.4 },
      rain_cloud: { elem2: "rad_cloud", chance: 0.4 },
      snow_cloud: { elem2: "rad_cloud", chance: 0.4 },
      hail_cloud: { elem2: "rad_cloud", chance: 0.4 },
      thunder_cloud: { elem2: "rad_cloud", chance: 0.4 },
      plant: { elem2: "dead_plant", chance: 0.4 },
      evergreen: { elem2: [
                "dead_plant",
                "plant"
              ], chance: 0.4 },
      cactus: { elem2: [
                "dead_plant",
                "plant",
                "cactus"
              ], chance: 0.4 },
      frozen_plant: { elem2: "dead_plant", chance: 0.4 },
      grass: { elem2: [
                "dead_plant",
                "straw",
                "grass_seed",
                "wheat_seed",
                "lettuce",
                "herb",
                "rice"
              ], chance: 0.4 },
      herb: { elem2: "dead_plant", chance: 0.4 },
      algae: { elem2: [
                "mushroom_spore",
                "lichen",
                "yeast",
                "kelp"
              ], chance: 0.4 },
      kelp: { elem2: [
                "mushroom_spore",
                "lichen",
                "yeast",
                "algae",
                "coral"
              ], chance: 0.4 },
      coral: { elem2: [
                "kelp",
                "algae"
              ], chance: 0.4 },
      mushroom_spore: { elem2: [
                "lichen",
                "yeast"
              ], chance: 0.4 },
      mushroom_cap: { elem2: [
                "lichen",
                "plant"
              ], chance: 0.4 },
      mushroom_stalk: { elem2: [
                "lichen",
                "yeast"
              ], chance: 0.4 },
      mushroom_gill: { elem2: [
                "lichen",
                "yeast"
              ], chance: 0.4 },
      flea: { elem2: [
                "ash",
                "ant",
                "termite"
              ], chance: 0.4 },
      ant: { elem2: [
                "ash",
                "flea",
                "termite",
                "bee"
              ], chance: 0.4 },
      termite: { elem2: [
                "ash",
                "flea",
                "ant"
              ], chance: 0.4 },
      fly: { elem2: [
                "ash",
                "firefly",
                "bee"
              ], chance: 0.4 },
      bee: { elem2: [
                "ash",
                "firefly",
                "fly",
                "ant"
              ], chance: 0.4 },
      firefly: { elem2: [
                "ash",
                "bee",
                "fly"
              ], chance: 0.4 },
      stink_bug: { elem2: "ash", chance: 0.4 },
      spider: { elem2: "ash", chance: 0.4 },
      frog: { elem2: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat",
                "tadpole"
              ], chance: 0.4 },
      tadpole: { elem2: [
                "frog",
                "frog",
                "worm",
                null
              ], chance: 0.4 },
      fish: { elem2: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.4 },
      rat: { elem2: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat",
                "plague"
              ], chance: 0.4 },
      bird: { elem2: [
                "ash",
                "meat",
                "rotten_meat",
                "cooked_meat",
                "plague"
              ], chance: 0.4 },
      bone: { elem2: [
                "quicklime",
                "quicklime",
                "quicklime",
                "cancer"
              ], chance: 0.4 },
      meat: { elem2: [
                "ash",
                "rotten_meat",
                "cooked_meat"
              ], chance: 0.4 },
      cheese: { elem2: "rotten_cheese", chance: 0.4 },
      cheese_powder: { elem2: "rotten_cheese", chance: 0.4 },
      rotten_meat: { elem2: [
                "ash",
                "meat",
                "cooked_meat"
              ], chance: 0.4 },
      cooked_meat: { elem2: [
                "ash",
                "rotten_meat"
              ], chance: 0.4 },
      bamboo: { elem2: [
                "wood",
                "plant",
                "bamboo_plant"
              ], chance: 0.4 },
      bamboo_plant: { elem2: [
                "wood",
                "plant",
                "bamboo"
              ], chance: 0.4 },
      sapling: { elem2: [
                "wood",
                "plant",
                "tree_branch"
              ], chance: 0.4 },
      tree_branch: { elem2: [
                "wood",
                "plant",
                "sapling"
              ], chance: 0.4 },
      grass_seed: { elem2: [
                "straw",
                "wheat_seed"
              ], chance: 0.4 },
      lichen: { elem2: "algae", chance: 0.4 },
      yeast: { elem2: [
                "algae",
                "mushroom_spore",
                "lichen"
              ], chance: 0.4 },
      wheat_seed: { elem2: [
                "straw",
                "wheat",
                "grass_seed"
              ], chance: 0.4 },
      flower_seed: { elem2: [
                "straw",
                "grass",
                "pistil",
                "petal"
              ], chance: 0.4 },
      pistil: { elem2: [
                "straw",
                "grass",
                "flower_seed",
                "petal"
              ], chance: 0.4 },
      petal: { elem2: [
                "straw",
                "grass",
                "flower_seed",
                "pistil"
              ], chance: 0.4 },
      vine: { elem1: [
                "vine"
              ], chance: 0.4 },
      worm: { elem2: "ash", chance: 0.4 },
      corn: { elem2: "popcorn", chance: 0.4 },
      corn_seed: { elem2: "corn", chance: 0.4 },
      potato: { elem2: [
                "potato_seed",
                "potato_seed",
                "potato_seed",
                "potato_seed",
                "potato_seed",
                "potato_seed",
                "explosion"
              ], chance: 0.4 },
      potato_seed: { elem2: "potato", chance: 0.4 },
      slug: { elem2: "slime", chance: 0.4 },
      snail: { elem2: "slime", chance: 0.4 },
      cell: { elem2: "cancer", chance: 0.4 },
      blood: { elem2: [
                "infection",
                "cancer"
              ], chance: 0.4 },
      antibody: { elem2: "cancer", chance: 0.4 },
      infection: { elem2: "cancer", chance: 0.4 },
      cancer: { chance: 0.3 },
      milk: { elem2: [
                "cheese",
                "rotten_cheese",
                "butter",
                "melted_cheese",
                "melted_butter",
                "cream"
              ], chance: 0.4 },
      chocolate_milk: { elem2: [
                "cheese",
                "rotten_cheese",
                "butter",
                "melted_cheese",
                "melted_butter",
                "cream"
              ], chance: 0.4 },
      fruit_milk: { elem2: [
                "cheese",
                "rotten_cheese",
                "butter",
                "melted_cheese",
                "melted_butter",
                "cream"
              ], chance: 0.4 },
      pilk: { elem2: [
                "cheese",
                "rotten_cheese",
                "butter",
                "melted_cheese",
                "melted_butter",
                "cream"
              ], chance: 0.4 },
      eggnog: { elem2: [
                "cheese",
                "rotten_cheese",
                "butter",
                "melted_cheese",
                "melted_butter",
                "cream"
              ], chance: 0.4 },
      nut_milk: { elem2: "rad_steam", chance: 0.4 },
      skin: { elem2: [
                "cooked_meat",
                "cancer",
                "ash",
                "skin",
                "hair"
              ], chance: 0.4 },
      hair: { elem2: [
                null,
                null,
                "ash"
              ], chance: 0.4 },
      tomato: { elem2: [
                "sauce",
                "ketchup"
              ], chance: 0.4 },
      sauce: { elem2: [
                "ketchup",
                "rad_steam"
              ], chance: 0.4 },
      ketchup: { elem2: [
                "sauce",
                "rad_steam"
              ], chance: 0.4 },
      pumpkin: { elem2: "pumpkin_seed", chance: 0.4 },
      pumpkin_seed: { elem2: "pumpkin", chance: 0.4 }
    }
  },
  "fallout": {
    color: [
          "#77a172",
          "#566c56",
          "#5e6c56",
          "#83a172"
        ],
    behavior: [
          "XX|CR:radiation%2|XX",
          "CR:radiation%2|CH:radiation%0.5|CR:radiation%2",
          "M2|M1 AND CR:radiation%2|M2"
        ],
    category: "energy",
    state: "solid",
    density: 1490,
    hidden: true
  },
  "neutron": {
    color: "#a6ffff",
    behavior: [
          "XX|XX|XX",
          "XX|CH:proton%0.25 AND DL%0.25|XX",
          "XX|XX|XX"
        ],
    category: "energy",
    state: "gas",
    density: 0.00003,
    temp: 35,
    ignoreAir: true,
    reactions: {
      uranium: { temp2: 100 },
      plant: { elem2: "wood", chance: 0.05 },
      gunpowder: { elem2: "dust", chance: 0.05 },
      yeast: { elem2: "bread", chance: 0.05 },
      silver: { elem1: [
                "radiation",
                null,
                null
              ], chance: 0.25 },
      firework: { func: null, chance: 0.01 },
      glass: { elem2: "rad_glass" },
      glass_shard: { elem2: "rad_shard" },
      cloud: { elem2: "rad_cloud" },
      rain_cloud: { elem2: "rad_cloud" }
    }
  },
  "proton": {
    color: "#ffa6a6",
    behavior: [
          "XX|XX|XX",
          "XX|DL%0.5|XX",
          "XX|XX|XX"
        ],
    category: "energy",
    state: "gas",
    density: 0.00002,
    temp: 40,
    conduct: 1,
    behaviorOn: [
          "XX|XX|XX",
          "XX|CH:hydrogen|XX",
          "XX|XX|XX"
        ],
    ignoreAir: true,
    reactions: {
      electric: { elem2: "hydrogen", temp2: 200 },
      nitrogen: { elem1: "flash", color1: "#5a9fdb", attr1: {
                delay: 500
              }, elem2: "flash", color2: "#5a9fdb", attr2: {
                delay: 500
              }, chance: 0.05, y: [
                10,
                20
              ] },
      oxygen: { elem1: "flash", color1: "#5adb63", attr1: {
                delay: 500
              }, elem2: "flash", color2: "#5adb63", attr2: {
                delay: 500
              }, chance: 0.05, y: [
                10,
                20
              ] },
      ozone: { elem1: "flash", color1: "#5adb63", attr1: {
                delay: 500
              }, elem2: "flash", color2: "#5adb63", attr2: {
                delay: 500
              }, chance: 0.05, y: [
                10,
                20
              ] }
    }
  },
  "electric": {
    color: "#fffba6",
    behavior: [
          "CL%5|CL%5 AND SH|CL%5",
          "CL%5 AND SH|SH%5 AND DL%50|CL%5 AND SH",
          "M1%15 AND CL%6|M1%50 AND CL%13 AND SH|M1%15 AND CL%6"
        ],
    category: "energy",
    state: "gas",
    density: 2.1,
    charge: 3,
    insulate: true,
    ignoreAir: true,
    alias: "electron"
  },
  // -------------------- POWDERS --------------------

  "uranium": {
    color: [
          "#599e61",
          "#364d3c",
          "#494d4a",
          "#6c8a42",
          "#798d65",
          "#b5e089"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|RL:radiation%1 AND CH:lead%0.001|XX",
          "M2|M1|M2"
        ],
    category: "powders",
    state: "solid",
    density: 19100,
    tempHigh: 1132.2,
    conduct: 0.235,
    hardness: 0.6,
    excludeRandom: true,
    reactions: {
      neutron: { elem1: "n_explosion", tempMin: 500, chance: 0.1 }
    },
    superconductAt: -271.95
  },
  "molten_uranium": {
    behavior: [
      ["XX", "CR:fire,fire,fire,radiation%4.5", "XX"],
      ["M2 AND CR:radiation%1", "XX", "M2 AND CR:radiation%1"],
      ["M1", "M1", "M1"]
    ],
    density: 17300,
    reactions: {
      neutron: { elem1: "n_explosion", tempMin: 200 },
      glass: { elem2: "rad_glass" },
      glass_shard: { elem2: "rad_shard" }
    }
  },
  "diamond": {
    color: [
          "#03fcec",
          "#03c6fc",
          "#b3eeff",
          "#8ab0e6"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 3515,
    hardness: 0.99,
    reactions: {
      oxygen: { elem1: "carbon_dioxide", tempMin: 900 },
      fire: { elem1: "carbon_dioxide", tempMin: 900 },
      smoke: { elem1: "carbon_dioxide", tempMin: 900 },
      molten_steel: { elem1: "carbon_dioxide", chance: 0.001 },
      charcoal: { elem2: "diamond", tempMin: 800, tempMax: 900, chance: 0.005, oneway: true }
    }
  },
  "gold_coin": {
    color: [
          "#fff0b5",
          "#ffe680",
          "#c48821",
          "#986a1a",
          "#eca832",
          "#f0bb62"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 19300,
    tempHigh: 1064,
    stateHigh: "molten_gold",
    conduct: 0.78,
    hardness: 0.2
  },
  "rust": {
    color: [
          "#ae551c",
          "#bc6e39",
          "#925f49"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "powders",
    state: "solid",
    density: 5250,
    tempHigh: 1538,
    stateHigh: "molten_iron",
    conduct: 0.37,
    hardness: 0.3,
    alias: "iron oxide"
  },
  "oxidized_copper": {
    color: [
          "#406555",
          "#42564a",
          "#517364"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "powders",
    state: "solid",
    density: 8960,
    tempHigh: 1085,
    stateHigh: "molten_copper",
    hidden: true,
    conduct: 0.85,
    hardness: 0.2,
    alias: "copper carbonate",
    reactions: {
      hydrogen: { tempMin: 900, elem1: "copper", elem2: "steam" }
    }
  },
  "alga": {
    color: [
          "#bab2ab",
          "#a3ab9d",
          "#a5a4a6",
          "#bcc7b3",
          "#d4c5b8",
          "#cac6cf"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "powders",
    state: "solid",
    density: 3905,
    tempHigh: 345.03,
    hidden: true,
    conduct: 0.39,
    hardness: 0.1,
    name: "AlGa",
    reactions: {
      water: { elem1: [
                "aluminum",
                "gallium"
              ], elem2: "hydrogen", chance: 0.01 }
    }
  },
  "metal_scrap": {
    color: [
          "#b0afb4",
          "#8c8f98",
          "#cbcdcd",
          "#6c6c6a",
          "#fef9ff"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2720,
    tempHigh: 1538,
    conduct: 0.43,
    hardness: 0.266,
    reactions: {
      rust: { elem2: "thermite", chance: 0.1 }
    }
  },
  "glass_shard": {
    color: [
          "#5e807d",
          "#679e99",
          "#596b6e"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2500,
    tempHigh: 1500,
    stateHigh: "molten_glass",
    reactions: {
      radiation: { elem1: "rad_shard", chance: 0.33 },
      rad_steam: { elem1: "rad_shard", chance: 0.33 },
      fallout: { elem1: "rad_shard", elem2: "radiation", chance: 0.1 }
    }
  },
  "rad_shard": {
    color: [
          "#648c64",
          "#6aad83",
          "#596e59"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["XX", "RL:radiation%1", "XX"],
      ["M2", "M1", "M2"]
    ],
    category: "powders",
    state: "solid",
    density: 2500,
    tempHigh: 1500,
    stateHigh: "molten_rad_glass",
    hidden: true
  },
  "brick_rubble": {
    color: [
          "#9c6262",
          "#a13a3a",
          "#cb4141",
          "#872626"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 1650,
    tempHigh: 1540,
    stateHigh: "molten_brick",
    hidden: true,
    hardness: 0.25
  },
  "baked_clay": {
    color: "#b85746",
    behavior: [
      ["XX", "XX", "XX"],
      ["SP", "XX", "SP"],
      ["XX", "M1", "XX"]
    ],
    category: "powders",
    state: "solid",
    density: 2000,
    tempHigh: 1300,
    stateHigh: "porcelain",
    breakInto: "clay_shard",
    hardness: 0.3
  },
  "clay_shard": {
    color: [
          "#b85746",
          "#9c4333",
          "#8a473b"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2000,
    tempHigh: 1300,
    stateHigh: "porcelain_shard",
    hidden: true,
    hardness: 0.25
  },
  "porcelain_shard": {
    color: [
          "#e1e4dd",
          "#c7c7c7",
          "#b8b8b8"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2000,
    hidden: true,
    hardness: 0.325,
    darkText: true
  },
  "feather": {
    color: [
          "#ffffff",
          "#e3e3e3",
          "#d1d1d1"
        ],
    behavior: [
      ["XX", "XX", "XX"],
      ["XX", "FX%0.25", "XX"],
      ["M2%10", "M1%10", "M1%10"]
    ],
    category: "powders",
    state: "solid",
    density: 500,
    tempHigh: 400,
    stateHigh: [
          "ash",
          "smoke",
          "smoke",
          "smoke"
        ],
    burn: 50,
    burnTime: 20,
    burnInto: [
          "ash",
          "smoke",
          "smoke",
          "smoke"
        ]
  },
  "confetti": {
    color: [
          "#dc2c37",
          "#edce66",
          "#0dbf62",
          "#0679ea",
          "#7144b2",
          "#d92097"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|FX%0.25|XX",
          "M2%25|M1%25|M1%25"
        ],
    category: "powders",
    state: "solid",
    density: 1201,
    tempHigh: 248,
    stateHigh: [
          "ash",
          "smoke",
          "smoke",
          "fire"
        ],
    burn: 15,
    burnTime: 150,
    burnInto: [
          "ash",
          "smoke",
          "smoke",
          "smoke"
        ],
    buttonColor: [
          "#ffe629",
          "#ff29c2"
        ],
    reactions: {
      water: { elem1: [
                null,
                "cellulose"
              ], chance: 0.001 },
      salt_water: { elem1: [
                null,
                "cellulose"
              ], chance: 0.001 },
      sugar_water: { elem1: [
                null,
                "cellulose"
              ], chance: 0.001 },
      dirty_water: { elem1: [
                null,
                "cellulose"
              ], chance: 0.001 },
      seltzer: { elem1: [
                null,
                "cellulose"
              ], chance: 0.001 },
      pool_water: { elem1: [
                null,
                "cellulose"
              ], chance: 0.001 }
    }
  },
  "glitter": {
    color: [
          "#c1bfe3",
          "#dbbfe3",
          "#cc95db",
          "#c477d9",
          "#b85cd1",
          "#8d5cd1",
          "#9e77d9",
          "#cc95db",
          "#95a4db",
          "#7789d9",
          "#5c68d1"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 1450,
    tempHigh: 100,
    stateHigh: [
          "fire",
          "fire",
          "dioxin"
        ],
    burn: 50,
    burnTime: 50,
    burnInto: [
          "smoke",
          "smoke",
          "dioxin"
        ]
  },
  "bead": {
    color: [
          "#ff5e5e",
          "#ffcc5e",
          "#76ff5e",
          "#5ed4ff",
          "#5e61ff",
          "#cf5eff"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 1052,
    tempHigh: 185,
    stateHigh: "molten_plastic",
    burn: 10,
    burnTime: 400,
    burnInto: "dioxin",
    darkText: true
  },
  "color_sand": {
    color: [
          "#ff4d4d",
          "#ffac4d",
          "#ffff4d",
          "#4dff4d",
          "#4dffff",
          "#4d4dff",
          "#ff4dff"
        ],
    category: "powders",
    state: "solid",
    density: 1602,
    tempHigh: 1700,
    stateHigh: "molten_stained_glass",
    darkText: true
  },
  "caustic_potash": {
    color: "#feffe8",
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2044,
    tempHigh: 410,
    hidden: true,
    alias: "potassium hydroxide"
  },
  "molten_caustic_potash": {
    color: "#8d8f6d",
    behavior: behaveLiquid,
    reactions: {
      aluminum: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0025 },
      zinc: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.015 },
      steel: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0125 },
      iron: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0125 },
      tin: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.01 },
      brass: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.001 },
      bronze: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.001 },
      copper: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0075 },
      silver: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0075 },
      gold: { elem1: [
                "potassium",
                "hydrogen",
                "oxygen"
              ], charged: true, chance: 0.0075 }
    }
  },
  "sodium_acetate": {
    color: [
          "#ededed",
          "#dbdbdb"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2|M1|M2"
        ],
    category: "powders",
    state: "solid",
    density: 1530,
    tempHigh: 881.4,
    hidden: true
  },
  "borax": {
    color: "#ffffff",
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 2370,
    tempHigh: 743,
    burn: 15,
    burnTime: 200,
    fireColor: [
          "#34eb67",
          "#5ceb34"
        ],
    alias: "sodium borate",
    reactions: {
      ant: { elem2: "dead_bug" },
      fly: { elem2: "dead_bug" },
      firefly: { elem2: "dead_bug" },
      stink_bug: { elem2: "dead_bug" },
      bee: { elem2: "dead_bug" },
      glue: { elem1: "slime", elem2: "slime", chance: 0.1 }
    }
  },
  "epsom_salt": {
    color: [
          "#f2f2f2",
          "#d6d6d6"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 1680,
    tempHigh: 1124,
    hidden: true,
    burn: 40,
    burnTime: 200,
    fireColor: [
          "#ffffff",
          "#fcf0f0"
        ],
    alias: [
          "epsom",
          "magnesium sulfate"
        ]
  },
  "potassium_salt": {
    color: [
          "#f2f2f2",
          "#e0e0e0"
        ],
    behavior: behavePowder,
    category: "powders",
    state: "solid",
    density: 3980,
    tempHigh: 292,
    hidden: true,
    burn: 40,
    burnTime: 200,
    fireColor: [
          "#ff00ee",
          "#ff6bf5"
        ],
    alias: "potassium chloride"
  },
  // -------------------- ENERGY --------------------

  "lightning": {
    color: "#ffffed",
    category: "energy",
    state: "gas",
    density: 1000,
    temp: 27760,
    tempLow: -273,
    stateLow: [
          "liquid_light",
          null
        ],
    hardness: 1,
    maxSize: 1,
    cooldown: 30,
    noMix: true,
    excludeRandom: true
  },
  "bless": {
    color: [
          "#ffffff",
          "#fffa9c",
          "#00ffff"
        ],
    behavior: [
          "M2|M1|M2",
          "M1|DL%25|M1",
          "M2|M1|M2"
        ],
    category: "energy",
    state: "gas",
    density: 0.001,
    temp: 20,
    ignore: [
          "sun"
        ],
    stain: -0.5,
    canPlace: true,
    reactions: {
      cancer: {  },
      rust: { elem2: "iron" },
      oxidized_copper: { elem2: "copper" },
      blood: { elem2: [
                "antibody",
                null
              ] },
      blood_ice: { elem2: "antibody_ice" },
      dirty_water: { elem2: "water" },
      plague: {  },
      virus: {  },
      filler: {  },
      armageddon: {  },
      lattice: {  },
      vertical: {  },
      horizontal: {  },
      gray_goo: { elem2: "malware" },
      infection: { elem2: [
                "antibody",
                null
              ] },
      antibody: { elem2: [
                "antibody",
                null
              ] },
      infection_ice: { elem2: "antibody_ice" },
      poison: { elem2: "antidote" },
      poison_gas: {  },
      poison_ice: {  },
      rotten_meat: { elem2: "meat" },
      rotten_cheese: { elem2: "cheese", color2: [
                "#B8BA9E",
                "#CDCAB2",
                "#C5CEC0",
                "#7B9691",
                "#41564B"
              ] },
      carbon_dioxide: { elem2: "oxygen" },
      pilk: { elem2: "milk" },
      acid: { elem2: "hydrogen" },
      acid_gas: { elem2: "hydrogen" },
      acid_cloud: { elem2: "rain_cloud" },
      fire_cloud: { elem2: "cloud" },
      ash: {  },
      molten_ash: {  },
      pyrocumulus: {  },
      cyanide: {  },
      cyanide_gas: {  },
      ammonia: {  },
      liquid_ammonia: {  },
      dioxin: {  },
      stench: {  },
      liquid_stench: {  },
      fragrance: {  },
      chlorine: {  },
      anesthesia: {  },
      oil: {  },
      bleach: {  },
      soda: { elem2: "seltzer" },
      ink: {  },
      dye: {  },
      color_smoke: {  },
      spray_paint: {  },
      rat: {  },
      flea: {  },
      termite: {  },
      smog: { elem2: "cloud" },
      mercury: {  },
      slime: {  },
      broth: { elem2: "water" },
      fire: { elem2: "bless" },
      plasma: { elem2: "bless" },
      grenade: { elem2: "metal_scrap" },
      flashbang: { elem2: "metal_scrap" },
      smoke_grenade: { elem2: "metal_scrap" },
      greek_fire: { elem2: "smoke" },
      nitro: {  },
      smoke: {  },
      lightning: {  },
      electric: {  },
      positron: {  },
      antimatter: {  },
      neutron: {  },
      proton: {  },
      radiation: { elem2: "flash" },
      uranium: { elem2: "rock" },
      molten_uranium: { elem2: "magma" },
      magma: { elem2: "rock" },
      mercury_gas: {  },
      solid_mercury: {  },
      ice_nine: { elem2: "ice" },
      strange_matter: {  },
      frozen_frog: { elem2: "frog" },
      frozen_worm: { elem2: "worm" },
      molten_thermite: { elem2: "rock" },
      rad_glass: { elem2: "glass" },
      rad_shard: { elem2: "glass_shard" },
      rad_steam: { elem2: "steam" },
      fallout: {  },
      rad_cloud: { elem2: "rain_cloud" },
      fireball: { elem2: "ball" },
      bone_marrow: { elem2: "bone" },
      fly: {  },
      dead_bug: {  },
      dead_plant: { elem2: "plant" },
      wood: {  },
      slag: { elem2: "rock" },
      molten_slag: { elem2: "magma" },
      laser: { elem2: "light" },
      light: { elem2: "flash" },
      torch: { elem2: "wood" },
      explosion: {  },
      n_explosion: {  },
      supernova: {  },
      pop: {  },
      ember: {  },
      fw_ember: {  },
      pollen: {  },
      lead: { elem2: "gold" },
      molten_lead: { elem2: "molten_gold" },
      dirt: { elem1: "grass", oneway: true },
      static: { elem2: "rainbow" },
      tornado: {  },
      tsunami: {  },
      earthquake: {  },
      blaster: {  },
      dust: {  },
      grease: {  },
      meat: { elem2: "cured_meat" },
      clay_shard: { elem2: "baked_clay" },
      porcelain_shard: { elem2: "porcelain" },
      glass_shard: { elem2: "glass" },
      brick_rubble: { elem2: "brick" },
      gunpowder: { elem2: "charcoal" },
      ruins: { elem2: "rock_wall" },
      warp: {  },
      midas_touch: {  },
      web: {  },
      heat_ray: {  },
      head: { attr2: {
                panic: 0
              } },
      body: { attr2: {
                panic: 0
              } }
    }
  },
  "god_ray": {
    color: [
          "#ffffff",
          "#ffee57"
        ],
    category: "energy",
    state: "gas",
    density: 1,
    darkText: true,
    noMix: true,
    excludeRandom: true
  },
  "heat_ray": {
    color: [
          "#ff0000",
          "#ff5e00"
        ],
    category: "energy",
    state: "gas",
    density: 1,
    temp: 3500,
    noMix: true,
    excludeRandom: true
  },
  "freeze_ray": {
    color: [
          "#00ffff",
          "#00b3ff"
        ],
    category: "energy",
    state: "gas",
    density: 1,
    temp: -270,
    noMix: true,
    excludeRandom: true
  },
  "pop": {
    color: [
          "#ffce8f",
          "#ffe091",
          "#ffe791"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|EX:3|XX",
          "XX|XX|XX"
        ],
    category: "energy",
    state: "gas",
    density: 1000,
    hidden: true,
    noMix: true,
    excludeRandom: true
  },
  "explosion": {
    color: [
          "#ffb48f",
          "#ffd991",
          "#ffad91"
        ],
    behavior: behaveGas,
    category: "energy",
    state: "gas",
    density: 0.3,
    temp: 300,
    noMix: true,
    excludeRandom: true
  },
  "n_explosion": {
    color: [
          "#c3ff91",
          "#8fffaf",
          "#8fffda"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|EX:40>plasma,plasma,plasma,plasma,radiation,rad_steam|XX",
          "XX|XX|XX"
        ],
    category: "energy",
    state: "gas",
    density: 1000,
    temp: 100000000,
    hidden: true,
    noMix: true,
    excludeRandom: true,
    alias: "nuclear explosion"
  },
  "supernova": {
    color: [
          "#ebf8ff",
          "#dbf3ff",
          "#b8e7ff"
        ],
    behavior: [
          "XX|XX|XX",
          "XX|EX:80>plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,molten_iron,molten_uranium,molten_lead,oxygen,molten_sodium,sulfur_gas,neon,chlorine,molten_calcium,molten_nickel,molten_copper,molten_zinc,gallium_gas,molten_potassium,mercury,molten_aluminum AND CH:void|XX",
          "XX|XX|XX"
        ],
    category: "energy",
    state: "gas",
    density: 1000,
    temp: 99999999700,
    hidden: true,
    hardness: 1,
    maxSize: 1,
    cooldown: 30,
    noMix: true,
    excludeRandom: true
  },
  "cook": {
    color: [
          "#5c3322",
          "#2b1107",
          "#5c3322",
          "#5c3322",
          "#2b1107",
          "#5c3322"
        ],
    behavior: behaveGas,
    state: "gas",
    category: "energy",
    density: 1
  },
  "incinerate": {
    color: [
          "#e600ff",
          "#d984d8",
          "#ff00e1"
        ],
    behavior: behaveGas,
    state: "gas",
    category: "energy",
    density: 1
  },
  "room_temp": {
    color: "#b1c96d",
    behavior: behaveGas,
    state: "gas",
    category: "energy",
    density: 1
  },
  "positron": {
    color: "#a6bfff",
    behavior: [
          "M1%15 AND CL%6|M1%50 AND CL%13|M1%15 AND CL%6",
          "CL%5|DL%50|CL%5",
          "CL%5|CL%5|CL%5"
        ],
    category: "energy",
    state: "gas",
    density: 2.1,
    hidden: true,
    insulate: true,
    ignoreAir: true,
    reactions: {
      electric: { elem1: "light", elem2: "explosion" },
      antimatter: { charge2: 10 }
    }
  },
  // -------------------- WEAPONS --------------------

  "tnt": {
    color: "#c92a2a",
    behavior: behaveWall,
    category: "weapons",
    state: "solid",
    density: 1630,
    tempHigh: 600,
    stateHigh: "explosion",
    conduct: 1,
    burn: 100,
    burnTime: 1,
    burnInto: "explosion",
    behaviorOn: [
          "XX|XX|XX",
          "XX|EX:10|XX",
          "XX|XX|XX"
        ],
    excludeRandom: true,
    alias: "trinitrotoluene"
  },
  "c4": {
    color: [
          "#d7c1a1",
          "#c8a77c"
        ],
    behavior: behaveSturdyPowder,
    category: "weapons",
    state: "solid",
    density: 1630,
    conduct: 1,
    burn: 5,
    burnTime: 800,
    burnInto: [
          "fire",
          "fire",
          "poison_gas"
        ],
    breakInto: "explosion",
    behaviorOn: [
          "XX|XX|XX",
          "XX|EX:10|XX",
          "XX|M1|XX"
        ],
    excludeRandom: true,
    name: "C-4"
  },
  "grenade": {
    color: "#5e5c57",
    behavior: [
          "XX|EX:6>metal_scrap,fire,fire,fire%1|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:6>metal_scrap,fire,fire,fire%1|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    tempHigh: 1455.5,
    stateHigh: "molten_steel",
    conduct: 1,
    behaviorOn: [
          "XX|XX|XX",
          "XX|EX:6>metal_scrap,fire,fire,fire%1|XX",
          "M2|M1 AND EX:6>metal_scrap,fire,fire,fire%1|M2"
        ],
    cooldown: 30,
    excludeRandom: true,
    nocheer: true
  },
  "dynamite": {
    color: [
          "#de5050",
          "#c92a2a",
          "#a61919"
        ],
    behavior: behavePowder,
    category: "weapons",
    state: "solid",
    density: 1300,
    tempHigh: 600,
    stateHigh: "explosion",
    conduct: 1,
    breakInto: "explosion",
    behaviorOn: [
          "XX|XX|XX",
          "XX|EX:15|XX",
          "XX|XX|XX"
        ],
    excludeRandom: true
  },
  "gunpowder": {
    color: [
          "#929980",
          "#757767",
          "#423d43"
        ],
    behavior: behavePowder,
    category: "weapons",
    state: "solid",
    density: 1700,
    tempHigh: 600,
    stateHigh: "explosion",
    conduct: 1,
    burn: 100,
    burnTime: 1,
    burnInto: [
          "explosion",
          "pop",
          "pop"
        ],
    behaviorOn: [
          "XX|XX|XX",
          "XX|EX:10|XX",
          "XX|XX|XX"
        ],
    excludeRandom: true,
    alias: "black powder"
  },
  // -------------------- ENERGY --------------------

  "ember": {
    color: [
          "#ffe985",
          "#ffd885",
          "#ffc285"
        ],
    behavior: behaveULUR,
    category: "energy",
    state: "gas",
    density: 600,
    temp: 300,
    tempLow: 0,
    stateLow: "ash",
    hidden: true,
    burn: 10,
    burnTime: 10,
    burnInto: "ash",
    burning: true,
    flippableX: true
  },
  // -------------------- WEAPONS --------------------

  "firework": {
    color: "#c44f45",
    behavior: behaveSturdyPowder,
    category: "weapons",
    state: "solid",
    density: 2000,
    conduct: 1,
    burn: 90,
    burnTime: 100,
    burning: true,
    properties: {
          burning: false
        }
  },
  // -------------------- ENERGY --------------------

  "fw_ember": {
    color: [
          "#ff7a70",
          "#ff9b70",
          "#ffe270",
          "#94ff70",
          "#00ffff",
          "#9b70ff",
          "#ffa8d2"
        ],
    behavior: behaveGas,
    category: "energy",
    state: "gas",
    density: 0.3,
    temp: 649,
    tempLow: 0,
    stateLow: "carbon_dioxide",
    hidden: true,
    burnInto: "ash",
    burning: true,
    fireElement: [
          "smoke",
          "smoke",
          "smoke",
          "smoke",
          "carbon_dioxide"
        ],
    darkText: true,
    rotatable: true,
    alias: "firework ember"
  },
  // -------------------- WEAPONS --------------------

  "nuke": {
    color: "#534636",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:60>plasma,plasma,plasma,plasma,radiation,rad_steam|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1500,
    cooldown: 30,
    excludeRandom: true
  },
  "h_bomb": {
    color: "#533636",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:90>plasma,plasma,plasma,plasma,fire|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1600,
    cooldown: 30,
    excludeRandom: true,
    alias: "hydrogen bomb"
  },
  "dirty_bomb": {
    color: "#415336",
    behavior: [
          "XX|XX|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:40>radiation,radiation,radiation,rad_steam|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1400,
    cooldown: 30,
    excludeRandom: true
  },
  "emp_bomb": {
    color: "#418273",
    behavior: behaveSturdyPowder,
    category: "weapons",
    state: "solid",
    density: 1400,
    cooldown: 30,
    excludeRandom: true,
    alias: "electromagnetic pulse bomb"
  },
  "nitro": {
    color: "#47c900",
    behavior: behaveLiquid,
    category: "weapons",
    state: "liquid",
    density: 1600,
    tempHigh: 600,
    tempLow: 14,
    stateHigh: "fire",
    stateLow: "frozen_nitro",
    conduct: 1,
    viscosity: 36,
    burn: 100,
    burnTime: 1,
    burnInto: "explosion",
    breakInto: "explosion",
    behaviorOn: [
          "XX|XX|XX",
          "XX|EX:10|XX",
          "XX|XX|XX"
        ],
    excludeRandom: true,
    alias: "nitroglycerin",
    reactions: {
      clay: { elem1: "dynamite", elem2: "dynamite" },
      tnt: { elem1: "dynamite", elem2: "dynamite" }
    }
  },
  "greek_fire": {
    color: [
          "#4a3923",
          "#594933",
          "#78654a"
        ],
    behavior: behaveLiquid,
    category: "weapons",
    state: "liquid",
    density: 498.5,
    tempHigh: 4000,
    stateHigh: "fire",
    viscosity: 2,
    burn: 100,
    burnTime: 1500,
    burnInto: "fire",
    burning: true,
    insulate: true,
    excludeRandom: true,
    properties: {
          burning: false
        },
    reactions: {
      water: {  },
      salt_water: {  },
      sugar_water: {  },
      dirty_water: {  },
      pool_water: {  },
      seltzer: {  },
      sand: { elem2: "wet_sand" },
      wet_sand: { chance: 0.05 },
      vinegar: { chance: 0.05 },
      dirt: { elem2: "mud" },
      clay_soil: { elem2: "clay" },
      plasma: { elem1: "fire" }
    }
  },
  "fireball": {
    color: [
          "#782828",
          "#783b28",
          "#784b28"
        ],
    behavior: [
          "XX|CR:fire%25|XX",
          "XX|CC:782828,783b28,784b28%25|XX",
          "M2|M1 AND EX:8|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1600,
    temp: 600,
    tempLow: -100,
    stateLow: "rock",
    burn: 100,
    burnTime: 170,
    burnInto: [
          "rock",
          "rock",
          "steam"
        ],
    burning: true,
    cooldown: 30,
    excludeRandom: true,
    glow: true,
    reactions: {
      water: { elem1: "rock", elem2: "steam" }
    }
  },
  "rocket": {
    color: "#ff6f47",
    behavior: behaveSturdyPowder,
    category: "weapons",
    state: "solid",
    density: 7300,
    ignore: [
          "cloner",
          "ecloner",
          "slow_cloner",
          "clone_powder",
          "floating_cloner"
        ],
    cooldown: 30
  },
  "antibomb": {
    color: "#adb3be",
    behavior: behaveSturdyPowder,
    category: "weapons",
    state: "solid",
    density: 4300,
    darkText: true,
    cooldown: 30
  },
  "cold_bomb": {
    color: "#43646e",
    behavior: [
          "XX|EX:10>cold_fire|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:10>cold_fire|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    tempHigh: 1455.5,
    stateHigh: "molten_steel",
    cooldown: 30,
    excludeRandom: true
  },
  "hot_bomb": {
    color: "#6c436e",
    behavior: [
          "XX|HT:20000 AND EX:15>plasma|XX",
          "XX|XX|XX",
          "M2|M1 AND HT:20000 AND EX:15>plasma|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    cooldown: 30,
    excludeRandom: true
  },
  "antimatter_bomb": {
    color: "#6e4343",
    behavior: [
          "XX|EX:20>antimatter|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:20>antimatter|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    tempHigh: 10455.5,
    stateHigh: "molten_steel",
    ignore: [
          "antimatter"
        ],
    cooldown: 30,
    excludeRandom: true
  },
  "party_popper": {
    color: [
          "#dc2c37",
          "#edce66",
          "#0dbf62",
          "#0679ea",
          "#7144b2",
          "#d92097"
        ],
    behavior: [
          "XX|EX:15>confetti,flash,flash,smoke|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:15>confetti,flash,flash,smoke|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    cooldown: 30,
    excludeRandom: true
  },
  "flashbang": {
    color: "#65665c",
    behavior: [
          "XX|EX:20>flash%1|XX",
          "XX|XX|XX",
          "M2|M1 AND EX:20>flash%1|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    tempHigh: 1455.5,
    stateHigh: "molten_steel",
    cooldown: 30,
    excludeRandom: true
  },
  // -------------------- ENERGY --------------------

  "flash": {
    color: "#fffdcf",
    category: "energy",
    state: "gas",
    density: 1,
    temp: 40,
    tempLow: -270,
    stateLow: [
          "liquid_light",
          null
        ],
    hidden: true,
    noMix: true,
    reactions: {
      blood: { elem1: "pointer" },
      electric: { elem1: "pointer" }
    }
  },
  // -------------------- WEAPONS --------------------

  "smoke_grenade": {
    color: "#65665c",
    behavior: [
          "XX|CR:smoke|XX",
          "XX|EX:4>smoke%1|XX",
          "M2|M1|M2"
        ],
    category: "weapons",
    state: "solid",
    density: 7300,
    tempHigh: 1455.5,
    stateHigh: "molten_steel",
    conduct: 0.73,
    cooldown: 30,
    excludeRandom: true,
    nocheer: true
  },
  "landmine": {
    color: "#856c7d",
    behavior: [
          "XX|EX:20|XX",
          "XX|XX|XX",
          "XX|M1|XX"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    tempHigh: 1455.5,
    stateHigh: "molten_steel",
    cooldown: 30,
    excludeRandom: true,
    nocheer: true
  },
  "tornado": {
    color: [
          "#b8b8b8",
          "#979797",
          "#787878"
        ],
    behavior: behaveGas,
    category: "weapons",
    state: "gas",
    density: 1.23,
    hardness: 1,
    maxSize: 1,
    cooldown: 30,
    excludeRandom: true,
    reactions: {
      fire: { attr1: {
                fired: "fire"
              } },
      sand: { attr1: {
                fired: "sand"
              } },
      wet_sand: { attr1: {
                fired: "sand"
              } },
      water: { attr1: {
                fired: "water"
              } },
      salt_water: { attr1: {
                fired: "water"
              } },
      lightning: { attr1: {
                fired: "lightning"
              } },
      radiation: { attr1: {
                fired: "radiation"
              } },
      midas_touch: { attr1: {
                fired: "midas_touch"
              } }
    },
    firedColors: {
          fire: [
            "#e07431",
            "#e34f32",
            "#e39944"
          ],
          sand: [
            "#bda880",
            "#998670",
            "#756951"
          ],
          water: [
            "#8a9bb5",
            "#728496",
            "#566978"
          ],
          lightning: [
            "#b5a78a",
            "#728496",
            "#ffe13d"
          ],
          radiation: [
            "#8ab58e",
            "#729681",
            "#56785c"
          ],
          midas_touch: [
            "#e3df6d",
            "#d4ae6e",
            "#e0c85a"
          ]
        }
  },
  "earthquake": {
    color: [
          "#bda791",
          "#997756",
          "#613d19"
        ],
    behavior: behaveWall,
    category: "weapons",
    state: "solid",
    density: 100000000,
    maxSize: 1,
    cooldown: 30,
    excludeRandom: true
  },
  "tsunami": {
    color: [
          "#91b9bd",
          "#566f99",
          "#192f61"
        ],
    behavior: behaveLiquid,
    category: "weapons",
    state: "liquid",
    density: 997,
    maxSize: 1,
    cooldown: 30,
    excludeRandom: true
  },
  "blaster": {
    color: [
          "#ff0000",
          "#ff4d00",
          "#ff7700"
        ],
    behavior: behaveWall,
    category: "weapons",
    state: "solid",
    density: 100000000,
    temp: 10000,
    hardness: 1,
    maxSize: 3,
    cooldown: 30,
    excludeRandom: true,
    glow: true
  },
  "armageddon": {
    color: "#a62900",
    behavior: [
          "XX|XX|XX",
          "XX|EX:10>armageddon,fire,fire,fire,fire,fire,fire,fire,fire,fire,fire,fire,fire%25 AND DL%10|XX",
          "XX|XX|XX"
        ],
    category: "weapons",
    state: "solid",
    density: 1300,
    hidden: true,
    maxSize: 1,
    cooldown: 30,
    excludeRandom: true
  },
  // -------------------- MACHINES --------------------

  "pressure_plate": {
    color: "#8a8a84",
    category: "machines",
    state: "solid",
    density: 7850
  },
  // -------------------- LIFE --------------------

  "primordial_soup": {
    color: [
          "#501f24",
          "#6d2e1d"
        ],
    behavior: [
          "XX|CR:foam%2|XX",
          "M2|CH:algae,cell,mushroom_spore,lichen,yeast,antibody,cellulose,seltzer,oxygen%0.005|M2",
          "M1|M1|M1"
        ],
    category: "life",
    state: "liquid",
    density: 955,
    temp: 30,
    tempHigh: 100,
    tempLow: -10,
    stateHigh: "steam",
    stateLow: [
          "ice",
          "ice",
          "ice",
          "sugar_ice"
        ],
    conduct: 0.05,
    stain: -0.1,
    behaviorOn: [
          "XX|CR:foam%25|XX",
          "M2|CH:algae,cell,mushroom_spore,lichen,yeast,antibody,cellulose,seltzer,oxygen%5|M2",
          "M1|M1|M1"
        ],
    reactions: {
      cancer: { elem1: "dirty_water" },
      cyanide: { elem1: "dirty_water" },
      cyanide_gas: { elem1: "dirty_water" },
      infection: { elem1: "dirty_water" },
      blood: { elem2: "antibody" },
      plague: { elem1: "dirty_water" },
      bleach: { elem1: "dirty_water" },
      poison: { elem1: "dirty_water" },
      soap: { elem1: "water" },
      alcohol: { elem1: "water" },
      mercury: { elem1: "dirty_water" },
      ammonia: { elem1: [
                "algae",
                "cell",
                "mushroom_spore",
                "lichen",
                "yeast",
                "antibody"
              ], chance: 0.05 },
      radiation: { elem1: [
                "algae",
                "cell",
                "mushroom_spore",
                "lichen",
                "yeast",
                "antibody"
              ], chance: 0.15 },
      uranium: { elem1: [
                "algae",
                "cell",
                "mushroom_spore",
                "lichen",
                "yeast",
                "antibody"
              ], chance: 0.001 },
      light: { elem1: [
                "algae",
                "cell",
                "mushroom_spore",
                "lichen",
                "yeast",
                "antibody"
              ], chance: 0.5 },
      carbon_dioxide: { elem2: "oxygen" },
      milk: { elem2: "yogurt" },
      cream: { elem2: "yogurt" },
      dirt: { elem2: "mud", chance: 0.2 },
      sand: { elem2: "wet_sand", chance: 0.2 },
      clay_soil: { elem2: "clay", chance: 0.2 },
      rock: { elem2: "wet_sand", chance: 0.001 },
      copper: { elem2: "oxidized_copper", chance: 0.05 },
      bronze: { elem2: "oxidized_copper", chance: 0.025 },
      iron: { elem2: "rust", chance: 0.025 },
      steel: { elem2: "rust", chance: 0.02 }
    }
  },
  "molten_slag": {
    ignore: [
          "salt",
          "plastic",
          "sulfur",
          "epsom_salt",
          "potassium_salt",
          "borax",
          "solder",
          "ash",
          "dirt",
          "tuff",
          "thermite",
          "molten_thermite"
        ]
  },
  "molten_dirt": {
    stateLow: [
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "mudstone",
          "rock"
        ]
  },
  // -------------------- EDIT --------------------

  "debug": {
    color: [
          "#b150d4",
          "#d1b74f"
        ],
    category: "edit",
    maxSize: 1
  },
  "prop": {
    color: [
          "#d46f50",
          "#d4aa50"
        ],
    category: "edit"
  },
  "salt_ice": {
    color: "#b6ced4"
  },
  "sugar_ice": {
    color: "#c8dee3"
  },
  "seltzer_ice": {
    color: "#a7c4c9"
  },
  "dirty_ice": {
    color: "#a9d9c7"
  },
  "pool_ice": {
    color: "#c0eff0"
  },
  "blood_ice": {
    color: "#ff7070"
  },
  "antibody_ice": {
    color: "#ff8080"
  },
  "infection_ice": {
    color: "#ff7090"
  },
};

export default elements;
