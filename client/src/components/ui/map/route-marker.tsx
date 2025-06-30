import { LineLayer, ShapeSource } from "@rnmapbox/maps";
import { PlaceMarker } from "./place-marker";

type Point = [number, number];

export interface Route {
  points: Point[];
  path: Point[];
  disabled?: boolean;
  routeId?: string;
}

export const RouteMarker = ({ points, path, disabled = false, routeId }: Route) => {
  function interpolate(p1: Point, p2: Point, t: number): Point {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  }

  const smoothCorners = (
    path: Point[],
    radius = 0.0005,
    resolution = 5
  ): Point[] => {
    if (path.length < 3) return path;

    const result: Point[] = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];

      // Trimmed points near the corner
      const before = interpolate(curr, prev, radius);
      const after = interpolate(curr, next, radius);

      // Arc interpolation between before and after
      for (let j = 0; j <= resolution; j++) {
        const t = j / resolution;
        const arcPoint: Point = [
          (1 - t) * (1 - t) * before[0] +
            2 * (1 - t) * t * curr[0] +
            t * t * after[0],
          (1 - t) * (1 - t) * before[1] +
            2 * (1 - t) * t * curr[1] +
            t * t * after[1],
        ];
        result.push(arcPoint);
      }
    }

    result.push(path[path.length - 1]);
    return result;
  };

  const smoothed = smoothCorners(path, 0.1, 15);

  const routeGeoJSON = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: smoothed,
    },
    properties: {},
  };

  return (
    <>
      {points.map((coords, id) => {
        return <PlaceMarker key={id} disabled={disabled} coordinate={coords} />;
      })}
      <ShapeSource id={`route${routeId}`} shape={routeGeoJSON}>
        <LineLayer
          id={`routeLine${routeId}`}
          style={{
            lineColor: disabled ? "#975DFF80" : "#975DFF",
            lineWidth: 4,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      </ShapeSource>
    </>
  );
};
