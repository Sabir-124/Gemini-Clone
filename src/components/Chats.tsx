import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { motion } from "framer-motion";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ImagePreview from "./ImagePreview";
import { useState, useEffect, useRef, Activity, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh,
  faXmark,
  faStar,
  faCopy,
  faMarker,
  faCheck,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useUIStore } from "../stores/uiStore";
import { useChatStore, type currentChatProps } from "../stores/chatStore";
import Option from "../Component Factory/Option";
import { useInputStore } from "../stores/inputStore";
import { useFileStore } from "../stores/fileStore";
import { ImagePhrase } from "../functions/imagePhrase";

const Chats = () => {
  // stores
  const { openImage, setOpenImage } = useUIStore();

  const {
    currentChat,
    starredMessages,
    setStarredMessages,
    scrollToMessageId,
    setScrollToMessageId,
    setEachChatId,
    hideEditingChatId,
    setHideEditingChatId,
  } = useChatStore();

  const { isEditing, setIsEditing, promptCall, setPromptCall, isTemporaryMsg } =
    useInputStore();

  const { setFile } = useFileStore();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [hoveredPrompt, setHoveredPrompt] = useState<{
    id: string;
    type: "prompt" | "response";
  } | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isCopied, setCopied] = useState(false);
  const [editingPromptID, setEditingPromptID] = useState<string | null>(null);

  const [currentResponseIndex, setCurrentResponseIndex] = useState<{
    [chatId: string]: number;
  }>({});

  const textRef = useRef<HTMLTextAreaElement>(null);
  const textAreaHeightRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textAreaHeightRef.current) {
      textAreaHeightRef.current.style.height = "auto";
      const scrollHeight = textAreaHeightRef.current.scrollHeight;
      const maxHeight = 300;
      const minHeight = 35;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textAreaHeightRef.current.style.height = newHeight + "px";
    }
  }, [textAreaHeightRef]);

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
  // Refs for each message
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to message effect
  useEffect(() => {
    if (scrollToMessageId !== null) {
      const element = messageRefs.current[scrollToMessageId];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });

          element.classList.add("highlight-message");
          setTimeout(() => {
            element.classList.remove("highlight-message");
          }, 2000);
        }, 100);
      }

      // Clear the scroll target after scrolling
      setScrollToMessageId(null);
    }
  }, [scrollToMessageId, setScrollToMessageId]);

  const handleOnhoverPrompt = (id: string, type: "prompt" | "response") => {
    setHoveredPrompt({ id, type });
  };
  const handleLeaveHoverPrompt = () => {
    setHoveredPrompt(null);
  };
  const onHoverOption = (option: string) => {
    setHoveredOption(option);
  };
  const leaveHoverOption = () => {
    setHoveredOption(null);
  };

  const handleAddStarredMessage = (chat: currentChatProps) => {
    const isStarred = starredMessages.some((message) => message.id === chat.id);
    if (isStarred) {
      setStarredMessages(
        starredMessages.filter((message) => message.id !== chat.id)
      );
    } else {
      setStarredMessages([...starredMessages, chat]);
    }
  };

  const handleCopyMessage = (message: string | undefined) => {
    if (message) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleEditButton = (
    { id, prompt, file }: currentChatProps,
    chatId: string
  ) => {
    setPromptCall(prompt);
    setEditingPromptID(id);
    if (file) {
      setFile(file);
    }
    setIsEditing(true);
    setEachChatId(chatId);
  };

  const handleCancelButton = () => {
    setIsEditing(false);
    setPromptCall("");
    setFile(null);
    setEachChatId(null);
  };

  const handleResendButton = (
    { id, prompt, file }: currentChatProps,
    chatId: string
  ) => {
    setPromptCall(prompt);
    setEditingPromptID(id);
    if (file) {
      setFile(file);
    }
    setEachChatId(chatId);

    setTimeout(() => {
      ImagePhrase();
      setHideEditingChatId(chatId);
    }, 0);
  };

  const newchatVariants = {
    hidden: { opacity: 0, y: 2 },
    visible: { opacity: 1, y: 0 },
  };

  const handleImageClick = (file: File | null | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setOpenImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDownload = (file: File | null | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (isEditing) {
      textRef.current?.focus();
    }
  }, [isEditing, editingPromptID]);

  const handleSendButton = useCallback(
    (id: string) => {
      setIsEditing(false);
      ImagePhrase();
      setHideEditingChatId(id);
    },
    [setIsEditing, setHideEditingChatId]
  );

  const handlePreviousResponse = (chatId: string) => {
    setCurrentResponseIndex((prev) => ({
      ...prev,
      [chatId]: Math.max((prev[chatId] || 0) - 1, 0),
    }));
  };

  const handleNextResponse = (chatId: string, maxIndex: number) => {
    setCurrentResponseIndex((prev) => ({
      ...prev,
      [chatId]: Math.min((prev[chatId] || 0) + 1, maxIndex),
    }));
  };

  const getCurrentResponse = (eachChat: currentChatProps[], chatId: string) => {
    const index = currentResponseIndex[chatId] || 0;
    return eachChat[index] || eachChat[0];
  };

  return (
    <>
      <div
        className={`flex flex-col gap-10 mt-4 ${
          currentChat.length > 0 && "mb-20"
        }`}
      >
        {currentChat.map(({ eachChat, id }, index) => {
          const currentResponse = getCurrentResponse(eachChat, id);
          const currentIndex = currentResponseIndex[id] || 0;
          const totalResponses = eachChat.length;
          const hasMultipleResponses = totalResponses > 1;
          return (
            <motion.div
              ref={(el) => {
                eachChat.forEach((chat) => {
                  messageRefs.current[chat.id] = el;
                });
              }}
              variants={newchatVariants}
              initial="hidden"
              animate="visible"
              key={index}
              className={`flex flex-col gap-2 transition-all duration-300 ${
                hideEditingChatId === id && "hidden"
              }`}
            >
              {eachChat[0].file?.type?.includes("image") ? (
                <div
                  onClick={() => handleImageClick(eachChat[0].file)}
                  className="self-end mb-2"
                >
                  <ImagePreview file={eachChat[0].file} />
                </div>
              ) : (
                eachChat[0].file && (
                  <div
                    onClick={() => handleFileDownload(eachChat[0].file)}
                    className="min-h-15 bg-[#434648] hover:bg-[#646769] mb-3 rounded-lg pl-5 pr-2.5 py-1.5 flex flex-col gap-1 self-end min-w-[40%] cursor-pointer transition"
                  >
                    <div className="font-semibold">
                      {eachChat[0].file.name?.split(".").shift()}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-auto h-10">
                        <img
                          loading="lazy"
                          className="h-full w-full"
                          src={eachChat[0].fileImage ?? undefined}
                          alt="uploaded image"
                        />
                      </div>
                      <div className="text-xs">
                        {eachChat[0].file.name?.split(".").pop()?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* User Prompt */}
              <Activity
                mode={
                  isEditing && editingPromptID === currentResponse.id
                    ? "visible"
                    : "hidden"
                }
              >
                <div className="w-full flex flex-col gap-2 justify-end">
                  <textarea
                    ref={(el) => {
                      textRef.current = el;
                      textAreaHeightRef.current = el;
                    }}
                    className="bg-[#262729] pl-5 py-2 rounded-lg w-full resize-none outline-none focus:ring-2 focus:ring-[#4479E1]"
                    value={promptCall}
                    onChange={(e) => setPromptCall(e.target.value)}
                    placeholder="Edit your prompt"
                  />
                  <div className="flex gap-2 justify-end text-sm">
                    <button
                      onClick={() => handleSendButton(id)}
                      className="px-4 py-2 cursor-pointer rounded-full bg-[#4479E1] hover:bg-[#5b86da] transition"
                    >
                      Send
                    </button>
                    <button
                      onClick={handleCancelButton}
                      className="px-4 py-2 cursor-pointer rounded-full bg-white hover:bg-white/90 transition text-black"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Activity>
              <Activity
                mode={
                  !isEditing || editingPromptID !== currentResponse.id
                    ? "visible"
                    : "hidden"
                }
              >
                <div
                  onMouseEnter={() =>
                    handleOnhoverPrompt(currentResponse.id, "prompt")
                  }
                  onMouseLeave={() => handleLeaveHoverPrompt()}
                  className="self-end sm:px-2 rounded-3xl rounded-tr-md w-full mb-4 font-sans"
                >
                  <div className="flex flex-col gap-2">
                    <pre className="bg-[#282A2C] px-5 py-3 rounded-3xl rounded-tr-md w-fit self-end max-w-full font-sans overflow-x-auto">
                      {currentResponse.prompt}
                    </pre>
                    <div className={`flex gap-1 items-center justify-end`}>
                      <>
                        <div
                          className={`${isTemporaryMsg && "hidden"}`}
                          onClick={() =>
                            handleAddStarredMessage(currentResponse)
                          }
                        >
                          <Option
                            onHover={onHoverOption}
                            onLeave={leaveHoverOption}
                            text={
                              starredMessages.some(
                                (message) => message.id === currentResponse.id
                              )
                                ? "Remove from starred"
                                : "Add to Starred Messages"
                            }
                            icon={
                              starredMessages.some(
                                (message) => message.id === currentResponse.id
                              )
                                ? faStar
                                : faStarRegular
                            }
                            hoveredPrompt={hoveredPrompt?.id ?? null}
                            hoveredOption={hoveredOption}
                            chat={currentResponse}
                          />
                        </div>
                        <div
                          onClick={() =>
                            handleCopyMessage(currentResponse.prompt)
                          }
                        >
                          <Option
                            onHover={onHoverOption}
                            onLeave={leaveHoverOption}
                            text={isCopied ? "Copied" : "Copy Prompt"}
                            icon={
                              isCopied &&
                              hoveredPrompt?.id === currentResponse.id
                                ? faCheck
                                : faCopy
                            }
                            hoveredPrompt={hoveredPrompt?.id ?? null}
                            hoveredOption={hoveredOption}
                            chat={currentResponse}
                          />
                        </div>
                        <div
                          onClick={() => handleEditButton(currentResponse, id)}
                        >
                          <Option
                            onHover={onHoverOption}
                            onLeave={leaveHoverOption}
                            text="Edit prompt"
                            icon={faMarker}
                            hoveredPrompt={hoveredPrompt?.id ?? null}
                            hoveredOption={hoveredOption}
                            chat={currentResponse}
                          />
                        </div>
                        <div
                          onClick={() =>
                            handleResendButton(currentResponse, id)
                          }
                        >
                          <Option
                            onHover={onHoverOption}
                            onLeave={leaveHoverOption}
                            text="Try again"
                            icon={faRefresh}
                            hoveredPrompt={hoveredPrompt?.id ?? null}
                            hoveredOption={hoveredOption}
                            chat={currentResponse}
                          />
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </Activity>

              {/* AI Response */}
              <div className="flex gap-5 items-start flex-1 overflow-hidden wrap-break-word">
                <img
                  loading="lazy"
                  src="/Gemini_Clone/icons/gemini.png"
                  alt="web-icon"
                  className="w-6 h-6 hidden sm:block"
                />
                <div
                  className={`${
                    currentResponse.isError
                      ? "bg-red-500/20 pt-2 px-3 pb-0 border border-red-500 rounded-lg w-fit"
                      : "flex-1 markdown overflow-hidden wrap-break-word"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      // Headings
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold mb-4 text-white"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-xl font-bold mb-3 text-white"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-lg font-bold mb-2 text-white"
                          {...props}
                        />
                      ),

                      // Paragraphs
                      p: ({ node, ...props }) => (
                        <p
                          className="mb-4 leading-relaxed text-gray-200"
                          {...props}
                        />
                      ),

                      // Lists
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc ml-6 mb-4 space-y-2 text-gray-200"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal ml-6 mb-4 space-y-2 text-gray-200"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                      ),

                      // Code blocks
                      code({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-4 text-sm overflow-x-auto"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="bg-[#2A2B2C] px-2 py-1 rounded text-sm text-blue-300 wrap-break-word max-w-full"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },

                      // Pre tag for code blocks
                      pre: ({ node, ...props }) => (
                        <pre
                          className="bg-[#2A2B2C] rounded-lg overflow-x-auto mb-4 max-w-full"
                          {...props}
                        />
                      ),

                      // Blockquotes
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-blue-500 pl-4 italic mb-4 text-gray-300"
                          {...props}
                        />
                      ),

                      // Links
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),

                      // Tables
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-4">
                          <table
                            className="min-w-full border-collapse border border-gray-600"
                            {...props}
                          />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-[#2A2B2C]" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          className="border border-gray-600 px-4 py-2 text-left"
                          {...props}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          className="border border-gray-600 px-4 py-2"
                          {...props}
                        />
                      ),

                      // Strong (bold)
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold text-white" {...props} />
                      ),

                      // Emphasis (italic)
                      em: ({ node, ...props }) => (
                        <em className="italic text-gray-300" {...props} />
                      ),
                    }}
                  >
                    {currentResponse.response}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div
                  onMouseEnter={() =>
                    handleOnhoverPrompt(currentResponse.id, "response")
                  }
                  onMouseLeave={() => handleLeaveHoverPrompt()}
                  className={`flex gap-1 items-center sm:ml-11`}
                >
                  <div
                    onClick={() => handleCopyMessage(currentResponse.response)}
                  >
                    <Option
                      onHover={onHoverOption}
                      onLeave={leaveHoverOption}
                      text={isCopied ? "Copied" : "Copy"}
                      icon={
                        isCopied && hoveredPrompt?.id === currentResponse.id
                          ? faCheck
                          : faCopy
                      }
                      hoveredPrompt={hoveredPrompt?.id ?? null}
                      hoveredOption={hoveredOption}
                      chat={currentResponse}
                    />
                  </div>
                  <div onClick={() => handleResendButton(currentResponse, id)}>
                    <Option
                      onHover={onHoverOption}
                      onLeave={leaveHoverOption}
                      text="Resend"
                      icon={faRefresh}
                      hoveredPrompt={hoveredPrompt?.id ?? null}
                      hoveredOption={hoveredOption}
                      chat={currentResponse}
                    />
                  </div>
                </div>

                <Activity mode={hasMultipleResponses ? "visible" : "hidden"}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreviousResponse(id)}
                      disabled={currentIndex === 0}
                      className={`w-8 h-8 rounded-full transition ${
                        currentIndex === 0
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-[#2A2B2C] cursor-pointer"
                      }`}
                      title="Previous response"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <span className="text-sm text-gray-400">
                      {currentIndex + 1} / {totalResponses}
                    </span>
                    <button
                      onClick={() => handleNextResponse(id, totalResponses - 1)}
                      disabled={currentIndex === totalResponses - 1}
                      className={`w-8 h-8 rounded-full transition ${
                        currentIndex === totalResponses - 1
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-[#2A2B2C] cursor-pointer"
                      }`}
                      title="Next response"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </Activity>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Activity mode={openImage && selectedImage ? "visible" : "hidden"}>
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-black/70 z-50">
          <div className="h-full flex justify-center items-center relative">
            <motion.img
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[70%] max-w-[80%] object-contain"
              src={
                selectedImage === ""
                  ? "/Gemini_Clone/images/image.png"
                  : selectedImage
              }
              alt="Full size preview"
            />
            <div
              onClick={() => setOpenImage(false)}
              className="absolute right-[5%] top-[5%] cursor-pointer hover:text-gray-300 transition-colors"
            >
              <FontAwesomeIcon size="2x" icon={faXmark} />
            </div>
          </div>
        </div>
      </Activity>

      {/* <style>{`
        .highlight-message {
          animation: highlight 2s ease-in-out;
        }

        @keyframes highlight {
          0%, 100% { 
            background-color: transparent; 
          }
          50% { 
            background-color: rgba(59, 130, 246, 0.2);
            border-radius: 8px;
          }
        }
      `}</style> */}
    </>
  );
};

export default Chats;
