import { AppState, Platform, Linking } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";

const LOCATION_TASK_NAME = "background-location-task";

// Конфигурация для foreground и background трекинга
const foregroundTracking = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 1,
  timeInterval: 1000, // Интервал в миллисекундах
};

const backgroundTracking = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 5,
  timeInterval: 5000, // Более редкие обновления в фоновом режиме
};

TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: TaskManager.TaskManagerTaskBody<{
    locations: Location.LocationObject[];
  }>): Promise<void> => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }
    const { locations } = data;
    if (locations && locations.length > 0) {
      const loc = locations[0];
      console.log("Background location received:", loc);
      // Здесь можно отправить данные на сервер или сохранить локально
    }
  }
);

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    console.log("Android permissions:", { foregroundStatus, backgroundStatus });
    if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
      console.log("Redirecting to settings");
      Linking.openSettings();
      return false;
    }
    return true;
  } else if (Platform.OS === "ios") {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    console.log("iOS permission status:", {
      foregroundStatus,
      backgroundStatus,
    });
    if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
      console.log("Redirecting to settings");
      Linking.openSettings();
      return false;
    }
    return true;
  }
  return false;
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const configure = async () => {
      console.log("Configuring expo-location");
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        console.log("Permissions not granted");
        return;
      }

      try {
        // Запускаем foreground трекинг
        const foregroundSubscription = await Location.watchPositionAsync(
          foregroundTracking,
          (loc) => {
            console.log("Foreground location received:", loc);
            if (loc.coords) {
              setLocation([loc.coords.longitude, loc.coords.latitude]);
            }
          }
        );

        // Запускаем background трекинг
        const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
          LOCATION_TASK_NAME
        );
        if (!isTaskRegistered) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            ...backgroundTracking,
            deferredUpdatesInterval: 5000,
            deferredUpdatesDistance: 5,
            showsBackgroundLocationIndicator: true, // Показывает индикатор на iOS
          });
          console.log("Background location task started");
        }
      } catch (error) {
        console.error("expo-location error:", error);
      }
    };

    configure();

    const listener = AppState.addEventListener("change", (state) => {
      console.log("AppState changed:", state);
      if (state === "active") {
        // Переключаемся на foreground трекинг
        Location.watchPositionAsync(foregroundTracking, (loc) => {
          if (loc.coords) {
            setLocation([loc.coords.longitude, loc.coords.latitude]);
          }
        });
      } else {
        // Переключаемся на background трекинг
        Location.startLocationUpdatesAsync(
          LOCATION_TASK_NAME,
          backgroundTracking
        );
      }
    });

    return () => {
      console.log("Cleaning up expo-location");
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      listener.remove();
    };
  }, []);

  return location;
};
