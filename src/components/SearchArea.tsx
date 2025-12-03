import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useCallback, useEffect } from "react";
import Microphone from "./Microphone";
import IconFactory from "../Component Factory/IconFactory";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import FilePreview from "./FilePreview";
import { ImagePhrase } from "../functions/imagePhrase";
import AiModelModal from "../Component Factory/AiModelModal";
import Label from "../Component Factory/Label";
import { useUIStore } from "../stores/uiStore";
import { useInputStore } from "../stores/inputStore";
import { useChatStore } from "../stores/chatStore";
import { useSystemStore } from "../stores/systemStore";
import { useFileStore } from "../stores/fileStore";
import FileModal from "../Component Factory/FileModal";

const SearchArea = () => {
  const setRender = useUIStore((state) => state.setRender);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);
  const setModelOpen = useUIStore((state) => state.setModelOpen);
  const isModelOpen = useUIStore((state) => state.isModelOpen);
  const promptCall = useInputStore((state) => state.promptCall);
  const setPromptCall = useInputStore((state) => state.setPromptCall);
  const isLoading = useInputStore((state) => state.isLoading);
  const setIsLoading = useInputStore((state) => state.setIsLoading);
  const isTemporaryMsg = useInputStore((state) => state.isTemporaryMsg);
  const isFileModalOpen = useUIStore((state) => state.isFileModalOpen);
  const setFileModalOpen = useUIStore((state) => state.setFileModalOpen);

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
  const setOfflineMsg = useSystemStore((state) => state.setOfflineMsg);
  const isOnline = useSystemStore((state) => state.isOnline);
  const isLgScreen = useSystemStore((state) => state.isLgScreen);
  const setScroll = useSystemStore((state) => state.setScroll);
  const selectedModal = useSystemStore((state) => state.selectedModal);

  const file = useFileStore((state) => state.file);
  const fileImage = useFileStore((state) => state.fileImage);
  const setFile = useFileStore((state) => state.setFile);
  const isVisible = useFileStore((state) => state.isVisible);
  const fileMsg = useFileStore((state) => state.fileMsg);
  const isSizeError = useFileStore((state) => state.isSizeError);

  const [label, setLabel] = useState(false);
  const [addfileText, setAddfileText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const internalInputRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const AiModalRef = useRef<HTMLDivElement>(null);
  const currentTextareaRef = internalInputRef;

  const adjustTextareaHeight = useCallback(() => {
    if (currentTextareaRef.current) {
      currentTextareaRef.current.style.height = "auto";
      const scrollHeight = currentTextareaRef.current.scrollHeight;
      const maxHeight = 200;
      const minHeight = 35;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      currentTextareaRef.current.style.height = newHeight + "px";
    }
  }, [currentTextareaRef]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [promptCall, adjustTextareaHeight]);

  useEffect(() => {
    const handleResize = () => {
      adjustTextareaHeight();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustTextareaHeight]);

  // File modal click-outside handler
  useEffect(() => {
    const handleFileModalOpen = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLabelClick =
        target.tagName === "LABEL" || target.closest("label");
      const isInputClick = target.tagName === "INPUT";

      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !isLabelClick &&
        !isInputClick
      ) {
        setFileModalOpen(false);
      }
    };

    if (isFileModalOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleFileModalOpen);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleFileModalOpen);
    };
  }, [isFileModalOpen, setFileModalOpen]);

  // AI modal click-outside handler - FIXED
  useEffect(() => {
    const handleAiModalOpen = (e: globalThis.MouseEvent) => {
      if (
        AiModalRef.current &&
        !AiModalRef.current.contains(e.target as Node)
      ) {
        setModelOpen(false);
      }
    };

    if (isModelOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleAiModalOpen);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleAiModalOpen);
    };
  }, [isModelOpen, setModelOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
        } else {
          e.preventDefault();

          if (promptCall.trim()) {
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
          }
        }
      }
    },
    [
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
      setScroll,
    ]
  );

  return (
    <>
      <div
        className={`flex flex-col justify-center rounded-4xl p-4 pt-5 transition border border-white/30 ${
          isTemporaryMsg ? "border-dashed" : ""
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {file && (
          <FilePreview fileInputRef={fileInputRef} fileImage={fileImage} />
        )}
        <textarea
          rows={1}
          placeholder={`${
            isTemporaryMsg ? "Ask questions in a temporary chat" : "Ask Gemini"
          }`}
          className={`focus:outline-none pl-2 resize-none w-full chat-scrollbar ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
          ref={currentTextareaRef}
          value={promptCall}
          disabled={isLoading}
          onChange={(e) => {
            setPromptCall(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="flex justify-between items-center">
          <div
            onClick={() => setLabel(!label)}
            className="flex gap-3 items-center relative"
          >
            <div
              onMouseEnter={() => setAddfileText(true)}
              onMouseLeave={() => setAddfileText(false)}
              onClick={(e) => {
                e.stopPropagation();
                setFileModalOpen(!isFileModalOpen);
              }}
              className="relative"
              ref={modalRef}
            >
              <IconFactory icon={faPlus} />
              <div className="absolute lg:-bottom-full lg:left-1/2 lg:-translate-x-1/2 lg:top-auto top-1/2 -translate-y-1/2 left-[125%] w-max pointer-events-none">
                <Label condition={addfileText} text="Add file" />
              </div>

              <FileModal
                fileInputRef={fileInputRef}
                modalRef={modalRef}
                inputId="fileUpload-search"
              />
            </div>

            <div
              className={`absolute left-[125%] w-max bg-[#353739] text-red-500 text-xs p-2 py-1 rounded-lg z-10 ${
                isVisible
                  ? "opacity-100 translate-0"
                  : "opacity-0 -translate-x-5 pointer-events-none"
              } transition`}
            >
              {fileMsg} file is not supported!
            </div>

            <div
              className={`absolute left-[125%] w-max bg-[#353739] text-red-500 text-xs p-2 py-1 rounded-lg z-10 ${
                isSizeError
                  ? "opacity-100 translate-0"
                  : "opacity-0 -translate-x-5 pointer-events-none"
              } transition`}
            >
              Can't accept file(s) larger than 20 MB!
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setModelOpen(!isModelOpen);
              }}
              className="flex items-center gap-3 hover:bg-white/20 px-3 py-2 rounded-full cursor-pointer relative"
            >
              <span>2.5 {selectedModal}</span>
              <div
                className={`${
                  isModelOpen ? "rotate-180" : "rotate-0"
                } transition duration-200`}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </div>

              <div
                ref={AiModalRef}
                onClick={(e) => e.stopPropagation()}
                className={`absolute top-[-500%] right-0 w-70 flex flex-col gap-4 bg-[#353739] p-4 rounded-lg ${
                  !isModelOpen ? "pointer-events-none" : ""
                } ${
                  isLgScreen && isModelOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-75"
                } transition`}
              >
                <AiModelModal />
              </div>
            </div>

            <Microphone />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchArea;
