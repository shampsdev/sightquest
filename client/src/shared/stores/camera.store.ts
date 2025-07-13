import { create } from "zustand";
import { ImageResult } from 'expo-image-manipulator';

interface TaskCompletionState {
  photo: ImageResult | null;
  setPhoto: (p: ImageResult) => void;
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
