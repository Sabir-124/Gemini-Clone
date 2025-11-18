import { create } from "zustand";

export interface currentChatProps {
  id: number;
  prompt: string;
  response: string | undefined;
  file?: File | null;
  fileImage?: string | null;
  isError: boolean;
}

export interface ChatSession {
  id: number;
  messages: currentChatProps[];
  timestamp: string;
  daystamp: string;
}

interface ChatState {
  currentChat: currentChatProps[];
  allChat: ChatSession[];
  currentId: number | null;
  loadingPrompt: string | null;
  setCurrentChat: (chat: currentChatProps[]) => void;
  addToCurrentChat: (chat: currentChatProps[]) => void;
  setAllChat: (chats: ChatSession | ChatSession[]) => void;
  updateLastChatInAllChat: (
    message: currentChatProps,
    chatId: number | null
  ) => void;
  clearCurrentChat: () => void;
  setCurrentId: (id: number) => void;
  setLoadingPrompt: (prompt: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChat: [],
  allChat: [],
  currentId: null,
  loadingPrompt: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),

  addToCurrentChat: (chat) =>
    set((state) => ({
      currentChat: [
        ...state.currentChat,
        ...(Array.isArray(chat) ? chat : [chat]),
      ],
    })),

  setAllChat: (chats) =>
    set((state) => ({
      allChat: [...state.allChat, ...(Array.isArray(chats) ? chats : [chats])],
    })),

  updateLastChatInAllChat: (message, chatId) =>
    set((state) => {
      if (state.allChat.length === 0) return state;
      const updatedAllChat = [...state.allChat];
      const chatIndex = state.allChat.findIndex((chat) => chat.id === chatId);
      if (chatIndex >= 0) {
        updatedAllChat[chatIndex] = {
          ...updatedAllChat[chatIndex],
          messages: [...updatedAllChat[chatIndex].messages, message],
        };
      }
      return { allChat: updatedAllChat };
    }),

  clearCurrentChat: () => set({ currentChat: [] }),
  setCurrentId: (id) => set({ currentId: id }),
  setLoadingPrompt: (prompt) => set({ loadingPrompt: prompt }),
}));
