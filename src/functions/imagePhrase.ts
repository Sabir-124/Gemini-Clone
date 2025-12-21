import { imageGenerationPhrases } from "../data/imagePrompts";
import { useChatStore } from "../stores/chatStore";
import { useInputStore } from "../stores/inputStore";
import { useSystemStore } from "../stores/systemStore";
import { useUIStore } from "../stores/uiStore";
import { handleSubmit } from "./handleSubmit";

export const ImagePhrase = () => {
  const isOnline = useSystemStore.getState().isOnline;
  const setImageError = useSystemStore.getState().setImageError;
  const setOfflineMsg = useSystemStore.getState().setOfflineMsg;

  const promptCall = useInputStore.getState().promptCall;
  const setPromptCall = useInputStore.getState().setPromptCall;

  const setLoadingPrompt = useChatStore.getState().setLoadingPrompt;

  const setRender = useUIStore.getState().setRender;
  const setIsChatOpen = useUIStore.getState().setIsChatOpen;

  if (isOnline || !isOnline) {
    if (imageGenerationPhrases.some((phrase) => promptCall.includes(phrase))) {
      setImageError(true);
      setTimeout(() => {
        setImageError(false);
      }, 5000);
      return;
    } else {
      setLoadingPrompt(promptCall);
      handleSubmit();
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
