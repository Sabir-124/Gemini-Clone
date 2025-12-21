import {
  faMicrophone,
  faPaperPlane,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import IconFactory from "../Component Factory/IconFactory";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePhrase } from "../functions/imagePhrase";
import Label from "../Component Factory/Label";
import { useInputStore } from "../stores/inputStore";
import { useSystemStore } from "../stores/systemStore";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Microphone: React.FC = () => {
  const promptCall = useInputStore((state) => state.promptCall);
  const setPromptCall = useInputStore((state) => state.setPromptCall);

  const setScroll = useSystemStore((state) => state.setScroll);

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
  }, [isSupported, isListening, setIsListening, recognitionRef]);

  const handleSendButton = useCallback(() => {
    setScroll(true);
    setTimeout(() => {
      setScroll(false);
    }, 3000);

    ImagePhrase();
  }, [setScroll]);

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
            <IconFactory icon={isListening ? faVolumeUp : faMicrophone} />
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
