import { create } from "zustand";

interface InputState {
  promptCall: string;
  isLoading: boolean;
  isTemporaryMsg: boolean;
  isEditing: boolean;
  setPromptCall: (prompt: string) => void;
  setIsLoading: (loading: boolean) => void;
  setTemporaryMsg: (bool: boolean) => void;
  setIsEditing: (bool: boolean) => void;
}

export const useInputStore = create<InputState>((set) => ({
  promptCall: "",
  isLoading: false,
  isTemporaryMsg: false,
  isEditing: false,

  setPromptCall: (prompt) => set({ promptCall: prompt }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setTemporaryMsg: (bool) => set({ isTemporaryMsg: bool }),
  setIsEditing: (bool) => set({ isEditing: bool }),
}));
