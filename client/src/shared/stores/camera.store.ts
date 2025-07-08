import { create } from "zustand";
import type { CameraCapturedPicture } from "expo-camera";

interface TaskCompletionState {
  photo: CameraCapturedPicture | null;
  setPhoto: (p: CameraCapturedPicture) => void;
  taskId: string | null;
  setTaskId: (taskId: string) => void;
  reset: () => void;
}

export const useTaskCompletionStore = create<TaskCompletionState>((set) => ({
  photo: null,
  setPhoto: (p) => set({ photo: p }),
  taskId: null,
  setTaskId: (taskId) => set({ taskId: taskId }),
  reset: () => set({ photo: null, taskId: null }),
}));
