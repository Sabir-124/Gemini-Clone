import { fetchAIResponse } from "../API/apiCall";
import type { ChatSession, currentChatProps } from "../stores/chatStore";

interface handleSubmitProps {
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
  isTemporaryMsg: boolean;
}

export const handleSubmit = async ({
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
}: handleSubmitProps) => {
  if (!promptCall.trim()) return;
  setIsLoading(true);

  const isFirstMessage = currentChat.length === 0;

  try {
    const aiResponse = await fetchAIResponse(promptCall, file);

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const newMessage: currentChatProps = {
      id: Date.now(),
      prompt: promptCall,
      response: aiResponse,
      file: file,
      fileImage: fileImage,
      isError: false,
    };
    addToCurrentChat([newMessage]);

    if (!isTemporaryMsg) {
      if (isFirstMessage) {
        const chatSession = {
          id: Date.now(),
          messages: [newMessage],
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          daystamp: new Date().toLocaleDateString(),
        };
        setAllChat([chatSession]);
        setCurrentId(chatSession.id);
      } else {
        updateLastChatInAllChat(newMessage, currentId);
      }
    }
    setFile(null);
  } catch (error) {
    console.error("Failed to fetch: ", error);

    const errorMessage: currentChatProps = {
      id: Date.now(),
      prompt: promptCall,
      response:
        "Error occured while fetching response from server. Please try again later or refresh the page.",
      file: file,
      fileImage: fileImage,
      isError: true,
    };
    addToCurrentChat([errorMessage]);

    if (!isTemporaryMsg) {
      if (isFirstMessage) {
        const chatSession = {
          id: Date.now(),
          messages: [errorMessage],
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          daystamp: new Date().toLocaleDateString(),
        };
        setAllChat([chatSession]);
        setCurrentId(chatSession.id);
      } else {
        updateLastChatInAllChat(errorMessage, currentId);
      }
    }
    setFile(null);
  } finally {
    setIsLoading(false);
  }
};
