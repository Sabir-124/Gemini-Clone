import { create } from "zustand";

interface SystemState {
  isOnline: boolean | undefined;
  offlineMsg: boolean;
  isLgScreen: boolean;
  imageError: boolean;
  scroll: boolean | null;
  selectedModal: string;
  setIsOnline: (bool: boolean | undefined) => void;
  setOfflineMsg: (bool: boolean) => void;
  setisLgScreen: (bool: boolean) => void;
  setImageError: (bool: boolean) => void;
  setScroll: (bool: boolean) => void;
  setSelectedModal: (modal: string) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  isOnline: undefined,
  offlineMsg: false,
  isLgScreen: window.innerWidth >= 1024,
  imageError: false,
  scroll: null,
  selectedModal: "flash",

  setIsOnline: (bool) => set({ isOnline: bool }),
  setOfflineMsg: (bool) => set({ offlineMsg: bool }),
  setisLgScreen: (bool) => set({ isLgScreen: bool }),
  setImageError: (bool) => set({ imageError: bool }),
  setScroll: (bool) => set({ scroll: bool }),
  setSelectedModal: (modal) => set({ selectedModal: modal }),
}));
