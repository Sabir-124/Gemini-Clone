import { create } from "zustand";

interface UIState {
  hideSidebar: boolean;
  hideBar: boolean;
  isSearchOpen: boolean;
  isChatOpen: boolean;
  isModelOpen: boolean;
  openImage: boolean;
  menuText: boolean;
  render: boolean;
  setHideBar: (bool: boolean) => void;
  setBar: (bool: boolean) => void;
  setIsSearchOpen: (bool: boolean) => void;
  setIsChatOpen: (bool: boolean) => void;
  setModelOpen: (bool: boolean) => void;
  setOpenImage: (bool: boolean) => void;
  setMenuText: (bool: boolean) => void;
  setRender: (bool: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hideSidebar: false,
  hideBar: true,
  isSearchOpen: false,
  isChatOpen: false,
  isModelOpen: false,
  openImage: false,
  menuText: false,
  render: true,

  setHideBar: (bool) => set({ hideSidebar: bool }),
  setBar: (bool) => set({ hideBar: bool }),
  setIsSearchOpen: (bool) => set({ isSearchOpen: bool }),
  setIsChatOpen: (bool) => set({ isChatOpen: bool }),
  setModelOpen: (bool) => set({ isModelOpen: bool }),
  setOpenImage: (bool) => set({ openImage: bool }),
  setMenuText: (bool) => set({ menuText: bool }),
  setRender: (bool) => set({ render: bool }),
}));
