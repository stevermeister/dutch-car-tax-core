export type FuelTypes = string[];

export type Province = {
  key: string;
  title: string;
};

export type Grid = {
  DR: string[];
  FL: string[];
  FR: string[];
  GL: string[];
  GR: string[];
  LI: string[];
  NB: string[];
  NH: string[];
  OV: string[];
  UT: string[];
  ZL: string[];
  ZH: string[];
};

export type FormValue = {
  provinceKey: string;
  fuelType: string;
  volume: number;
};
