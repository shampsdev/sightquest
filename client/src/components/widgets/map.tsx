import Mapbox, { MapView } from "@rnmapbox/maps";

// TODO - replace & move to .env
Mapbox.setAccessToken(
  "sk.eyJ1IjoibWlrZWRlZ2VvZnJveSIsImEiOiJjbWJieWlicnUwdzQ2MmlzYjA0b2psdnVuIn0.S6eNlhjph0xm95IqTN-AuA"
);

export const Map = () => {
  return (
    <MapView
      scaleBarEnabled={false}
      attributionEnabled={false}
      styleURL="mapbox://styles/mikedegeofroy/cma57ielt004801s3gkciegzd"
      className="flex-1"
    />
  );
};
