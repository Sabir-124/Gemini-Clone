import { imageGenerationPhrases } from "../data/imagePrompts";
import type { ChatSession, currentChatProps } from "../stores/chatStore";
import { handleSubmit } from "./handleSubmit";

interface ImagePhraseProps {
  isOnline: boolean | undefined;
  setImageError: (bool: boolean) => void;
  setPromptCall: (prompt: string) => void;
  setRender: (bool: boolean) => void;
  setIsChatOpen: (bool: boolean) => void;
  setOfflineMsg: (bool: boolean) => void;
  file: File | null;
  fileImage: string | null;
  promptCall: string;
  currentChat: currentChatProps[];
  currentId: number | null;
  addToCurrentChat: (chat: currentChatProps[]) => void;
  updateLastChatInAllChat: (
    message: currentChatProps,
    chatId: number | null
  ) => void;
  setFile: (file: File | null) => void;
  setAllChat: (chats: ChatSession | ChatSession[]) => void;
  setCurrentId: (id: number) => void;
  setIsLoading: (bool: boolean) => void;
  setLoadingPrompt: (prompt: string | null) => void;
  isTemporaryMsg: boolean;
}

export const ImagePhrase = ({
  isOnline,
  setImageError,
  setPromptCall,
  setRender,
  setIsChatOpen,
  setOfflineMsg,
  file,
  fileImage,
  promptCall,
  currentChat,
  currentId,
  addToCurrentChat,
  updateLastChatInAllChat,
  setFile,
  setAllChat,
  setCurrentId,
  setIsLoading,
  setLoadingPrompt,
  isTemporaryMsg,
}: ImagePhraseProps) => {
  if (isOnline) {
    if (imageGenerationPhrases.some((phrase) => promptCall.includes(phrase))) {
      setImageError(true);
      setTimeout(() => {
        setImageError(false);
      }, 5000);
      return;
    } else {
      setLoadingPrompt(promptCall);
      handleSubmit({
        file,
        fileImage,
        promptCall,
        currentChat,
        currentId,
        addToCurrentChat,
        updateLastChatInAllChat,
        setFile,
        setAllChat,
        setCurrentId,
        setIsLoading,
        isTemporaryMsg,
      });
      setPromptCall("");
      setRender(false);
      setIsChatOpen(true);
    }
  } else {
    setOfflineMsg(true);
    setTimeout(() => {
      setOfflineMsg(false);
    }, 5000);
  }
};
