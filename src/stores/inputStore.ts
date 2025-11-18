import { create } from "zustand";

interface InputState {
  promptCall: string;
  isLoading: boolean;
  isTemporaryMsg: boolean;
  setPromptCall: (prompt: string) => void;
  setIsLoading: (loading: boolean) => void;
  setTemporaryMsg: (bool: boolean) => void;
}

export const useInputStore = create<InputState>((set) => ({
  promptCall: "",
  isLoading: false,
  isTemporaryMsg: false,

  setPromptCall: (prompt) => set({ promptCall: prompt }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setTemporaryMsg: (bool) => set({ isTemporaryMsg: bool }),
}));
