import { LineLayer, ShapeSource } from "@rnmapbox/maps";
import { Point } from "@/shared/interfaces/route";

export interface RouteProps {
  shapes: React.ReactNode[];
  path: Point[];
  disabled?: boolean;
  routeId?: string;
}

export const RouteMarker = ({
  shapes: points,
  path,
  disabled = false,
  routeId,
}: RouteProps) => {
  function interpolate(p1: Point, p2: Point, t: number): Point {
    return {
      location: {
        lon: p1.location.lon + (p2.location.lon - p1.location.lon) * t,
        lat: p1.location.lat + (p2.location.lat - p1.location.lat) * t,
      },
    };
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

      const before = interpolate(curr, prev, radius);
      const after = interpolate(curr, next, radius);

      for (let j = 0; j <= resolution; j++) {
        const t = j / resolution;
        const arcPoint: Point = {
          location: {
            lon:
              (1 - t) * (1 - t) * before.location.lon +
              2 * (1 - t) * t * curr.location.lon +
              t * t * after.location.lon,
            lat:
              (1 - t) * (1 - t) * before.location.lat +
              2 * (1 - t) * t * curr.location.lat +
              t * t * after.location.lat,
          },
        };
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
      coordinates: smoothed.map((p) => [p.location.lon, p.location.lat]),
    },
    properties: {},
  };

  return (
    <>
      {points}
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
