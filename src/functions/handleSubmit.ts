import { fetchAIResponse } from "../API/apiCall";
import {
  useChatStore,
  type currentChatProps,
  type EachChatProps,
} from "../stores/chatStore";
import { useFileStore } from "../stores/fileStore";
import { useInputStore } from "../stores/inputStore";

export const handleSubmit = async () => {
  const isTemporaryMsg = useInputStore.getState().isTemporaryMsg;
  const promptCall = useInputStore.getState().promptCall;
  const setIsLoading = useInputStore.getState().setIsLoading;

  const file = useFileStore.getState().file;
  const fileImage = useFileStore.getState().fileImage;
  const setFile = useFileStore.getState().setFile;

  const addToCurrentChat = useChatStore.getState().addToCurrentChat;
  const setAllChat = useChatStore.getState().setAllChat;
  const setCurrentId = useChatStore.getState().setCurrentId;
  const updateLastChatInAllChat =
    useChatStore.getState().updateLastChatInAllChat;
  const currentId = useChatStore.getState().currentId;
  const currentChat = useChatStore.getState().currentChat;
  const eachChatId = useChatStore.getState().eachChatId;
  const setHideEditingChatId = useChatStore.getState().setHideEditingChatId;

  if (!promptCall.trim()) return;
  setIsLoading(true);

  const isFirstMessage = currentChat.length === 0;

  try {
    const aiResponse = await fetchAIResponse(promptCall, file);

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const message: currentChatProps = {
      id: crypto.randomUUID(),
      prompt: promptCall,
      response: aiResponse,
      file: file,
      fileImage: fileImage,
      isError: false,
    };
    const newMessage: EachChatProps = {
      id: crypto.randomUUID(),
      eachChat: [message],
    };
    addToCurrentChat([newMessage], eachChatId);

    if (!isTemporaryMsg) {
      if (isFirstMessage) {
        const chatSession = {
          id: crypto.randomUUID(),
          title: newMessage.eachChat[0].prompt,
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
        updateLastChatInAllChat(newMessage, currentId, eachChatId);
      }
    }
    setFile(null);
    setIsLoading(false);
  } catch (error) {
    console.error("Failed to fetch: ", error);

    const errorMessage: currentChatProps = {
      id: crypto.randomUUID(),
      prompt: promptCall,
      response:
        "Error occured while fetching response from server. Please try again later or refresh the page.",
      file: file,
      fileImage: fileImage,
      isError: true,
    };
    const newErrorMessage: EachChatProps = {
      id: crypto.randomUUID(),
      eachChat: [errorMessage],
    };
    addToCurrentChat([newErrorMessage], eachChatId);

    if (!isTemporaryMsg) {
      if (isFirstMessage) {
        const chatSession = {
          id: crypto.randomUUID(),
          title: newErrorMessage.eachChat[0].prompt,
          messages: [newErrorMessage],
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
        updateLastChatInAllChat(newErrorMessage, currentId, eachChatId);
      }
    }
    setFile(null);
    setIsLoading(false);
  } finally {
    setHideEditingChatId(null);
  }
};
