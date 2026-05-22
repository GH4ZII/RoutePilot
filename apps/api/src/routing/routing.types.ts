export type RoutingPoint = {
  id: string;
  latitude: number;
  longitude: number;
};

export type DistanceTimeMatrix = {
  pointIds: string[];
  distancesMeters: number[][];
  durationsSeconds: number[][];
};
