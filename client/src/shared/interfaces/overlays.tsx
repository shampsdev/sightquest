import {
  ChatOverlay,
  ChatOverlayProps,
} from "../../components/overlays/chat.overlay";
import {
  TaskCompletedOverlay,
  TaskCompletedOverlayProps,
} from "../../components/overlays/task-completed.overlay";
import {
  PauseOverlay,
  PauseOverlayProps,
} from "../../components/overlays/pause.overlay";
import {
  CameraOverlay,
  CameraOverlayProps,
} from "../../components/overlays/camera.overlay";
import {
  UpdateRoleOverlay,
  UpdateRoleOverlayProps,
} from "../../components/overlays/update-role.overlay";
import {
  SendPhotoOverlay,
  SendPhotoOverlayProps,
} from "../../components/overlays/send-photo.overlay";
import { StartGameOverlay, StartGameOverlayProps } from '@/components/overlays/start-game.overlay';

export interface OverlayPropsMap {
  chat: Omit<ChatOverlayProps, "visible">;
  taskCompleted: Omit<TaskCompletedOverlayProps, "visible">;
  pause: Omit<PauseOverlayProps, "visible">;
  camera: Omit<CameraOverlayProps, "visible">;
  updateRole: Omit<UpdateRoleOverlayProps, "visible">;
  sendPhoto: Omit<SendPhotoOverlayProps, "visible">;
  startGame: Omit<StartGameOverlayProps, "visible">;
}

export type OverlayName = keyof OverlayPropsMap;

type OverlayComponentProps<Name extends OverlayName> = OverlayPropsMap[Name] & {
  visible: boolean;
  onClose: () => void;
};

export const overlayRegistry: {
  [K in OverlayName]: React.ComponentType<OverlayComponentProps<K>>;
} = {
  chat: ChatOverlay,
  taskCompleted: TaskCompletedOverlay,
  pause: PauseOverlay,
  camera: CameraOverlay,
  updateRole: UpdateRoleOverlay,
  sendPhoto: SendPhotoOverlay,
  startGame: StartGameOverlay,
};
