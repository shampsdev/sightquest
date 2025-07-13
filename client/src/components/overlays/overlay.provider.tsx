import { useOverlays } from "@/shared/hooks/useOverlays";
import { ChatOverlay } from "./chat.overlay";
import { TaskCompletedOverlay } from "./task-completed.overlay";
import { PauseOverlay } from "./pause.overlay";
import { CameraOverlay } from "./camera.overlay";
import { UpdateRoleOverlay } from "./update-role.overlay";
import { CompleteTaskOverlay } from "./complete-task.overlay";

export const OverlayProvider = () => {
  const { openOverlay, closeOverlay, isOverlayOpen, isAnyOverlayOpen } =
    useOverlays();
  return (
    <>
      <ChatOverlay visible={isOverlayOpen("chat")} onClose={closeOverlay} />
      <TaskCompletedOverlay visible={isOverlayOpen("taskCompleted")} />
      <PauseOverlay visible={isOverlayOpen("pause")} />
      <CameraOverlay
        visible={isOverlayOpen("camera")}
        onClose={closeOverlay}
        onSucces={() => {
          openOverlay("sendPhoto");
        }}
      />
      <UpdateRoleOverlay
        visible={isOverlayOpen("updateRole")}
        onClose={closeOverlay}
      />
      <CompleteTaskOverlay
        visible={isOverlayOpen("sendPhoto")}
        onClose={closeOverlay}
      />
    </>
  );
};
