import { CameraCapturedPicture } from "expo-camera";
import { Player } from "./player";

export type OverlayKey =
  | "chat"
  | "camera"
  | "completeTask"
  | "pause"
  | "updateRole"
  | "catchRunner"
  | null;

export type OverlayPropsMap = {
  chat: {};
  camera: {
    destinationOverlay: "completeTask";
  };
  pause: {};
  completeTask: {
    taskId: string;
    photo: CameraCapturedPicture | null;
  };
  newRunner: {
    player: Player;
  };
};
