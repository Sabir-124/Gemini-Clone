import { create } from "zustand";

export interface currentChatProps {
  id: string;
  prompt: string;
  response: string | undefined;
  file?: File | null;
  fileImage?: string | null;
  isError: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: EachChatProps[];
  timestamp: string;
  daystamp: string;
}

export interface EachChatProps {
  id: string;
  eachChat: currentChatProps[];
}

interface ChatState {
  currentChat: EachChatProps[];
  allChat: ChatSession[];
  currentId: string | null;
  loadingPrompt: string | null;
  scrollToMessageId: string | null;
  setCurrentChat: (chat: EachChatProps[]) => void;
  addToCurrentChat: (chat: EachChatProps[], id: string | null) => void;
  setAllChat: (chats: ChatSession | ChatSession[]) => void;
  updateLastChatInAllChat: (
    message: EachChatProps,
    chatId: string | null,
    eachChatId: string | null
  ) => void;
  clearCurrentChat: () => void;
  setCurrentId: (id: string) => void;
  setLoadingPrompt: (prompt: string | null) => void;
  setScrollToMessageId: (id: string | null) => void;
  starredMessages: currentChatProps[];
  setStarredMessages: (chat: currentChatProps[]) => void;
  deleteChat: (chatId: string | null) => void;
  eachChatId: string | null;
  setEachChatId: (id: string | null) => void;
  hideEditingChatId: string | null;
  setHideEditingChatId: (id: string | null) => void;
  isNewResponse: boolean;
  setNewResponse: (bool: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChat: [],
  allChat: [],
  currentId: null,
  loadingPrompt: null,
  scrollToMessageId: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),

  addToCurrentChat: (chat, id) =>
    set((state) => {
      if (!id) {
        return {
          currentChat: [...state.currentChat, ...chat],
        };
      } else {
        const chatIndex = state.currentChat.findIndex((c) => c.id === id);
        if (chatIndex === -1) return state;

        const updatedCurrentChat = [...state.currentChat];
        const existingEachChat = updatedCurrentChat[chatIndex].eachChat;
        const editedMessage = chat[0].eachChat[0];
        const messageIndex = existingEachChat.findIndex(
          (msg) => msg.id === editedMessage.id
        );
        if (messageIndex !== -1) {
          existingEachChat[messageIndex] = editedMessage;
        } else {
          existingEachChat.push(editedMessage);
        }

        updatedCurrentChat[chatIndex] = {
          ...updatedCurrentChat[chatIndex],
          eachChat: [...existingEachChat],
        };

        state.setEachChatId(null);
        return { currentChat: updatedCurrentChat };
      }
    }),

  setAllChat: (chats) =>
    set((state) => ({
      allChat: [...state.allChat, ...(Array.isArray(chats) ? chats : [chats])],
    })),

  updateLastChatInAllChat: (message, chatId, eachChatId) =>
    set((state) => {
      if (state.allChat.length === 0 || eachChatId) return state;
      const updatedAllChat = [...state.allChat];
      const chatIndex = state.allChat.findIndex((chat) => {
        return chat.id === chatId;
      });
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
  setScrollToMessageId: (id) => set({ scrollToMessageId: id }),

  starredMessages: [],
  setStarredMessages: (chat) => set({ starredMessages: chat }),

  deleteChat: (chatId) =>
    set((state) => ({
      allChat: state.allChat.filter((chats) => chats.id !== chatId),
    })),

  eachChatId: null,
  setEachChatId: (id) => set({ eachChatId: id }),

  hideEditingChatId: null,
  setHideEditingChatId: (id) => set({ hideEditingChatId: id }),

  isNewResponse: false,
  setNewResponse: (bool) => set({ isNewResponse: bool }),
}));
