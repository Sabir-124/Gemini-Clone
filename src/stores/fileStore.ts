import { create } from "zustand";

interface FileState {
  file: File | null;
  filePreview: string | null;
  fileImage: string | null;
  fileMsg: string | undefined;
  isVisible: boolean;
  isSizeError: boolean;
  setFile: (file: File | null) => void;
  setFilePreview: (preview: string | null) => void;
  setFileImage: (image: string | null) => void;
  setFileMsg: (msg: string | undefined) => void;
  setVisible: (bool: boolean) => void;
  setSizeError: (bool: boolean) => void;
}

export const useFileStore = create<FileState>((set) => ({
  file: null,
  filePreview: null,
  fileImage: null,
  fileMsg: "",
  isVisible: false,
  isSizeError: false,

  setFile: (file) => set({ file }),
  setFilePreview: (preview) => set({ filePreview: preview }),
  setFileImage: (image) => set({ fileImage: image }),
  setFileMsg: (msg) => set({ fileMsg: msg }),
  setVisible: (bool) => set({ isVisible: bool }),
  setSizeError: (bool) => set({ isSizeError: bool }),
}));
