import { AppState } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";
import { useEffect, useState } from "react";

const foregroundTracking = {
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  distanceFilter: 1,
  notification: {
    title: "Tracking",
    text: "You're moving",
  },
};

const backgroundTracking = {
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  distanceFilter: 5,
  notification: {
    title: "Tracking",
    text: "In background",
  },
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const configure = async () => {
      await BackgroundGeolocation.ready({
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        ...foregroundTracking,
      });

      BackgroundGeolocation.start();

      BackgroundGeolocation.onMotionChange(({ isMoving }) => {
        BackgroundGeolocation.setConfig(
          isMoving ? foregroundTracking : backgroundTracking
        );
      });
    };

    configure();

    const unsubscribe = BackgroundGeolocation.onLocation((loc) => {
      if (loc.coords) {
        setLocation([loc.coords.longitude, loc.coords.latitude]);
      }
    });

    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        BackgroundGeolocation.setConfig(foregroundTracking);
      } else {
        BackgroundGeolocation.setConfig(backgroundTracking);
      }
    });

    return () => {
      BackgroundGeolocation.removeListeners();
      listener.remove();
      unsubscribe.remove();
    };
  }, []);

  return location;
};
