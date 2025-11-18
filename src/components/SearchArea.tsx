import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useState,
  type ChangeEvent,
  type MutableRefObject,
  useRef,
  useCallback,
} from "react";
import Microphone from "./Microphone";
import IconFactory from "../Component Factory/IconFactory";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { supportedFiles } from "../data/supportedFiles";
import FilePreview from "./FilePreview";
import { ImagePhrase } from "../functions/imagePhrase";
import { model } from "../Component Factory/AiModelModal";
import AiModelModal from "../Component Factory/AiModelModal";
import Label from "../Component Factory/Label";
import { useUIStore } from "../stores/uiStore";
import { useInputStore } from "../stores/inputStore";
import { useChatStore } from "../stores/chatStore";
import { useSystemStore } from "../stores/systemStore";
import { useFileStore } from "../stores/fileStore";

interface SearchAreaProp {
  inputRef?: MutableRefObject<HTMLInputElement | null>;
}

const SearchArea = ({ inputRef }: SearchAreaProp) => {
  const setRender = useUIStore((state) => state.setRender);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);
  const setModelOpen = useUIStore((state) => state.setModelOpen);
  const isModelOpen = useUIStore((state) => state.isModelOpen);
  const promptCall = useInputStore((state) => state.promptCall);
  const setPromptCall = useInputStore((state) => state.setPromptCall);
  const isLoading = useInputStore((state) => state.isLoading);
  const setIsLoading = useInputStore((state) => state.setIsLoading);
  const isTemporaryMsg = useInputStore((state) => state.isTemporaryMsg);

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

  const file = useFileStore((state) => state.file);
  const fileImage = useFileStore((state) => state.fileImage);
  const setFile = useFileStore((state) => state.setFile);
  const setFilePreview = useFileStore((state) => state.setFilePreview);
  const setVisible = useFileStore((state) => state.setVisible);
  const isVisible = useFileStore((state) => state.isVisible);
  const setFileImage = useFileStore((state) => state.setFileImage);
  const fileMsg = useFileStore((state) => state.fileMsg);
  const setFileMsg = useFileStore((state) => state.setFileMsg);
  const isSizeError = useFileStore((state) => state.isSizeError);
  const setSizeError = useFileStore((state) => state.setSizeError);

  const [label, setLabel] = useState(false);
  const [addfileText, setAddfileText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];

      const MAX_FILE_SIZE = 30 * 1024 * 1024;

      if (selectedFile && selectedFile?.size < MAX_FILE_SIZE) {
        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

        supportedFiles.some((file) => {
          if (fileExtension && file.file === fileExtension) {
            setFileImage(file.icon);
            setVisible(false);
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
              setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
          }
        });

        if (
          fileExtension &&
          !supportedFiles.some((file) => file.file.includes(fileExtension))
        ) {
          setFileMsg(fileExtension);
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 3500);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } else {
        setSizeError(true);
        setTimeout(() => {
          setSizeError(false);
        }, 3500);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [
      setFile,
      setFileImage,
      setFilePreview,
      setFileMsg,
      setVisible,
      setSizeError,
      fileInputRef,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && promptCall.trim()) {
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
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {file && (
          <FilePreview fileInputRef={fileInputRef} fileImage={fileImage} />
        )}
        <input
          type="text"
          placeholder={`${
            isTemporaryMsg ? "Ask questions in a temporary chat" : "Ask Gemini"
          }`}
          className={`focus:outline-none mb-5 pl-2 w-full ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
          ref={inputRef}
          value={promptCall}
          disabled={isLoading}
          onChange={(e) => setPromptCall(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between items-center">
          <div
            onClick={() => setLabel(!label)}
            className="flex gap-3 items-center relative"
          >
            <label
              onMouseEnter={() => setAddfileText(true)}
              onMouseLeave={() => setAddfileText(false)}
              htmlFor="fileUpload"
              className="relative"
            >
              <IconFactory icon={faPlus} />
              <div className="absolute lg:-bottom-full lg:left-1/2 lg:-translate-x-1/2 lg:top-auto top-1/2 -translate-y-1/3 left-[125%] w-max pointer-events-none">
                <Label condition={addfileText} text="Add file" />
              </div>
            </label>
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              id="fileUpload"
              className="hidden pointer-events-none"
            />

            {/* file errors */}
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

          {/* modal selection & microphone */}
          <div className="flex gap-3 items-center">
            <div
              onClick={() => setModelOpen(!isModelOpen)}
              className="flex items-center gap-3 hover:bg-white/20 px-3 py-2 rounded-full cursor-pointer relative ref"
            >
              <span>2.5 {model}</span>
              <div
                className={`${
                  isModelOpen ? "rotate-180" : "rotate-0"
                } transition duration-200`}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </div>

              <div
                className={`absolute top-[-500%] right-0 w-70 flex flex-col gap-4 bg-[#353739] p-4 rounded-lg ${
                  !isModelOpen ? "pointer-events-none " : ""
                } ${
                  isLgScreen && isModelOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-75"
                } transition`}
              >
                <AiModelModal />
              </div>
            </div>

            {/* Microphone section */}
            <Microphone />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchArea;
