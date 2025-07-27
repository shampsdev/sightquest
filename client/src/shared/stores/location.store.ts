import { create } from "zustand";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LocationObject, LocationSubscription } from "expo-location";
import { TaskManagerTaskBody } from "expo-task-manager";
import { Linking, Platform } from "react-native";
import { logger } from "../instances/logger.instance";

const LOCATION_TASK_NAME = "background-location-task";

interface GeolocationState {
  location: [number, number] | null;
  isTracking: boolean;
  foregroundSubscription: LocationSubscription | null;
  setLocation: (newLocation: [number, number]) => void;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
}

const foregroundTracking = {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 5,
  timeInterval: 3000,
};

const backgroundTracking = {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 10,
  timeInterval: 10000,
};

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

TaskManager.defineTask<{ locations: LocationObject[] }>(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: TaskManagerTaskBody<{ locations: LocationObject[] }>): Promise<void> => {
    if (error) {
      logger.error("geo", "Background location task error:", error);
      return;
    }
    const { locations } = data;
    if (locations && locations.length > 0) {
      const loc = locations[0];
      logger.log("geo", "backgorund >", loc);
      useGeolocationStore
        .getState()
        .setLocation([loc.coords.longitude, loc.coords.latitude]);
    }
  }
);

export const useGeolocationStore = create<GeolocationState>((set, get) => ({
  location: null,
  isTracking: false,
  foregroundSubscription: null,
  setLocation: debounce(
    (newLocation: [number, number]) => set({ location: newLocation }),
    1000
  ),
  startTracking: async () => {
    const { isTracking } = get();
    if (isTracking) return;

    logger.log("geo", "started tracking");
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      logger.log("geo", "Permissions not granted");
      return;
    }

    try {
      const foregroundSubscription = await Location.watchPositionAsync(
        foregroundTracking,
        (loc) =>
          debounce(() => {
            if (loc.coords) {
              set({ location: [loc.coords.longitude, loc.coords.latitude] });
            }
          }, 1000)
      );

      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TASK_NAME
      );
      if (!isTaskRegistered) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          ...backgroundTracking,
          deferredUpdatesInterval: 5000,
          deferredUpdatesDistance: 5,
          showsBackgroundLocationIndicator: true,
        });
        logger.log("geo", "Background task started");
      }

      set({ isTracking: true, foregroundSubscription });
    } catch (error) {
      logger.error("geo", error);
    }
  },
  stopTracking: async () => {
    const { isTracking, foregroundSubscription } = get();
    if (!isTracking) return;

    logger.log("geo", "Stopping tracking");
    if (foregroundSubscription) {
      foregroundSubscription.remove();
    }
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    set({ isTracking: false, location: null, foregroundSubscription: null });
  },
}));

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    logger.log("geo", ": Android permissions:", {
      foregroundStatus,
      backgroundStatus,
    });
    if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
      logger.log("geo", ": Redirecting to settings");
      Linking.openSettings();
      return false;
    }
    return true;
  } else if (Platform.OS === "ios") {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    logger.log("geo", "iOS permissions:", {
      foregroundStatus,
      backgroundStatus,
    });
    if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
      logger.log("geo", ": Redirecting to settings");
      Linking.openSettings();
      return false;
    }
    return true;
  }
  return false;
};
