import Constants from "expo-constants";
import { ImageSourcePropType } from "react-native";

export const API_URL = Constants?.expoConfig?.extra?.apiUrl;
export const MAPBOX_TOKEN = Constants?.expoConfig?.extra?.mapboxToken;
export const MAPBOX_STYLE_URL = Constants?.expoConfig?.extra?.mapboxStyleUrl;
export const SOCKET_URL = Constants?.expoConfig?.extra?.socketUrl;

export const AVATARS = [
  { id: "1", src: require("@/assets/avatars/avatar-1.png") },
  { id: "2", src: require("@/assets/avatars/avatar-2.png") },
  { id: "3", src: require("@/assets/avatars/avatar-3.png") },
  { id: "4", src: require("@/assets/avatars/avatar-4.png") },
  { id: "5", src: require("@/assets/avatars/avatar-5.png") },
  { id: "6", src: require("@/assets/avatars/avatar-6.png") },
  { id: "7", src: require("@/assets/avatars/avatar-7.png") },
  { id: "8", src: require("@/assets/avatars/avatar-8.png") },
  { id: "9", src: require("@/assets/avatars/avatar-9.png") },
  { id: "10", src: require("@/assets/avatars/avatar-10.png") },
  { id: "11", src: require("@/assets/avatars/avatar-11.png") },
  { id: "12", src: require("@/assets/avatars/avatar-12.png") },
  { id: "13", src: require("@/assets/avatars/avatar-13.png") },
  { id: "14", src: require("@/assets/avatars/avatar-14.png") },
  { id: "15", src: require("@/assets/avatars/avatar-15.png") },
  { id: "16", src: require("@/assets/avatars/avatar-16.png") },
  { id: "17", src: require("@/assets/avatars/avatar-17.png") },
] as const;

export const ACTIVITIES: Record<"wins" | "matches", ImageSourcePropType> = {
  wins: require("@/assets/activites/wins.png"),
  matches: require("@/assets/activites/matches.png"),
} as const;

export const SHOP_SECTIONS = ["Аватарки", "Маршруты"] as const;

export const DEFAULT_MAP_CAMERA_LOCATION: [number, number] = [
  30.308354, 59.955536,
] as const;
