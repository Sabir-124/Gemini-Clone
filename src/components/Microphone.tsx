import { faMicrophone, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import IconFactory from "../Component Factory/IconFactory";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePhrase } from "../functions/imagePhrase";
import Label from "../Component Factory/Label";
import { useFileStore } from "../stores/fileStore";
import { useInputStore } from "../stores/inputStore";
import { useChatStore } from "../stores/chatStore";
import { useSystemStore } from "../stores/systemStore";
import { useUIStore } from "../stores/uiStore";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Microphone: React.FC = () => {
  const file = useFileStore((state) => state.file);
  const fileImage = useFileStore((state) => state.fileImage);
  const setFile = useFileStore((state) => state.setFile);

  const promptCall = useInputStore((state) => state.promptCall);
  const isTemporaryMsg = useInputStore((state) => state.isTemporaryMsg);
  const setIsLoading = useInputStore((state) => state.setIsLoading);
  const setPromptCall = useInputStore((state) => state.setPromptCall);

  const currentChat = useChatStore((state) => state.currentChat);
  const currentId = useChatStore((state) => state.currentId);
  const addToCurrentChat = useChatStore((state) => state.addToCurrentChat);
  const updateLastChatInAllChat = useChatStore(
    (state) => state.updateLastChatInAllChat
  );
  const setAllChat = useChatStore((state) => state.setAllChat);
  const setCurrentId = useChatStore((state) => state.setCurrentId);
  const setLoadingPrompt = useChatStore((state) => state.setLoadingPrompt);

  const setImageError = useSystemStore((state) => state.setImageError);
  const isOnline = useSystemStore((state) => state.isOnline);
  const setOfflineMsg = useSystemStore((state) => state.setOfflineMsg);
  const setScroll = useSystemStore((state) => state.setScroll);

  const setRender = useUIStore((state) => state.setRender);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [microphoneText, setMicrophoneText] = useState(false);
  const [sendText, setSendText] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPromptCall(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone access denied. PLease enable microphone permissions."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (!isSupported) {
        alert(
          "Speech recognition is not supported in your browser. Please use Chrome or Edge."
        );
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!isSupported) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting recognition: ", error);
      }
    }
  }, [isSupported, isListening]);

  const handleSendButton = useCallback(() => {
    setScroll(true);
    setTimeout(() => {
      setScroll(false);
    }, 3000);

    ImagePhrase({
      isOnline,
      promptCall,
      file,
      fileImage,
      currentChat,
      currentId,
      addToCurrentChat,
      updateLastChatInAllChat,
      setFile,
      setAllChat,
      setImageError,
      setPromptCall,
      setCurrentId,
      setIsLoading,
      setRender,
      setIsChatOpen,
      setOfflineMsg,
      setLoadingPrompt,
      isTemporaryMsg,
    });
  }, [
    isOnline,
    promptCall,
    file,
    fileImage,
    currentChat,
    currentId,
    addToCurrentChat,
    updateLastChatInAllChat,
    setFile,
    setAllChat,
    setImageError,
    setPromptCall,
    setCurrentId,
    setIsLoading,
    setRender,
    setIsChatOpen,
    setOfflineMsg,
    isTemporaryMsg,
  ]);

  return (
    <div className="relative">
      <div>
        {promptCall.trim() ? (
          <div
            onMouseEnter={() => setSendText(true)}
            onMouseLeave={() => setSendText(false)}
            onClick={handleSendButton}
          >
            <IconFactory icon={faPaperPlane} />
          </div>
        ) : (
          <div
            onClick={toggleListening}
            onMouseEnter={() => setMicrophoneText(true)}
            onMouseLeave={() => setMicrophoneText(false)}
          >
            <IconFactory icon={faMicrophone} />
          </div>
        )}
      </div>
      <div className="absolute -top-[75%] right-0 lg:left-1/2 lg:-translate-x-1/2 w-max pointer-events-none">
        <Label
          condition={promptCall.trim() ? sendText : microphoneText}
          text={promptCall.trim() ? "Send message" : "Chat with your voice"}
        />
      </div>
    </div>
  );
};

export default Microphone;
