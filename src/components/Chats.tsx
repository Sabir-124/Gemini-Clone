import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { motion } from "framer-motion";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ImagePreview from "./ImagePreview";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh,
  faXmark,
  faStar,
  faCopy,
  faMarker,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useUIStore } from "../stores/uiStore";
import { useChatStore, type currentChatProps } from "../stores/chatStore";
import Option from "../Component Factory/Option";
import { useInputStore } from "../stores/inputStore";

const Chats = () => {
  // stores
  // const isLoading = useInputStore((state) => state.isLoading);
  const openImage = useUIStore((state) => state.openImage);
  const setOpenImage = useUIStore((state) => state.setOpenImage);
  const currentChat = useChatStore((state) => state.currentChat);
  const setStarredMessages = useChatStore((state) => state.setStarredMessages);
  const starredMessages = useChatStore((state) => state.starredMessages);
  const scrollToMessageId = useChatStore((state) => state.scrollToMessageId);
  const setScrollToMessageId = useChatStore(
    (state) => state.setScrollToMessageId
  );
  // const loadingPrompt = useChatStore((state) => state.loadingPrompt);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [hoveredPrompt, setHoveredPrompt] = useState<{
    id: number;
    type: "prompt" | "response";
  } | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isCopied, setCopied] = useState(false);
  const [edit, setEdit] = useState(false);

  // Refs for each message
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

  const handleOnhoverPrompt = (id: number, type: "prompt" | "response") => {
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

  return (
    <>
      <div className="flex flex-col gap-10">
        {currentChat.map((chat, index) => (
          <>
            <motion.div
              ref={(el) => {
                messageRefs.current[chat.id] = el;
              }}
              variants={newchatVariants}
              initial="hidden"
              animate="visible"
              key={index}
              className="flex flex-col gap-2 transition-all duration-300"
            >
              {chat.file?.type?.includes("image") ? (
                <div
                  onClick={() => handleImageClick(chat.file)}
                  className="self-end mb-2"
                >
                  <ImagePreview file={chat.file} />
                </div>
              ) : (
                chat.file && (
                  <div
                    onClick={() => handleFileDownload(chat.file)}
                    className="min-h-15 bg-[#434648] hover:bg-[#646769] mb-3 rounded-lg pl-5 pr-2.5 py-1.5 flex flex-col gap-1 self-end min-w-[40%] cursor-pointer transition"
                  >
                    <div className="font-semibold">
                      {chat.file.name?.split(".").shift()}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-auto h-10">
                        <img
                          loading="lazy"
                          className="h-full w-full"
                          src={chat.fileImage ?? undefined}
                          alt=""
                        />
                      </div>
                      <div className="text-xs">
                        {chat.file.name?.split(".").pop()?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )
              )}
              {/* User Prompt */}
              <div
                onMouseEnter={() => handleOnhoverPrompt(chat.id, "prompt")}
                onMouseLeave={() => handleLeaveHoverPrompt()}
                className="self-end sm:px-5 py-3 rounded-3xl rounded-tr-md max-w-full mb-4 font-sans"
              >
                <div className="flex flex-col gap-2">
                  <pre className="bg-[#282A2C] px-5 py-3 rounded-3xl rounded-tr-md max-w-full font-sans overflow-x-auto">
                    {chat.prompt}
                  </pre>
                  <div className={`flex gap-1 items-center justify-end`}>
                    <>
                      <div onClick={() => handleAddStarredMessage(chat)}>
                        <Option
                          onHover={onHoverOption}
                          onLeave={leaveHoverOption}
                          text={
                            starredMessages.some(
                              (message) => message.id === chat.id
                            )
                              ? "Remove from starred"
                              : "Add to Starred Messages"
                          }
                          icon={
                            starredMessages.some(
                              (message) => message.id === chat.id
                            )
                              ? faStar
                              : faStarRegular
                          }
                          hoveredPrompt={hoveredPrompt?.id ?? null}
                          hoveredOption={hoveredOption}
                          chat={chat}
                        />
                      </div>
                      <div>
                        <Option
                          onHover={onHoverOption}
                          onLeave={leaveHoverOption}
                          text="Edit Text"
                          icon={faMarker}
                          hoveredPrompt={hoveredPrompt?.id ?? null}
                          hoveredOption={hoveredOption}
                          chat={chat}
                        />
                      </div>
                      <div onClick={() => handleCopyMessage(chat.prompt)}>
                        <Option
                          onHover={onHoverOption}
                          onLeave={leaveHoverOption}
                          text={isCopied ? "Copied" : "Copy Prompt"}
                          icon={
                            isCopied && hoveredPrompt?.id === chat.id
                              ? faCheck
                              : faCopy
                          }
                          hoveredPrompt={hoveredPrompt?.id ?? null}
                          hoveredOption={hoveredOption}
                          chat={chat}
                        />
                      </div>
                      <div>
                        <Option
                          onHover={onHoverOption}
                          onLeave={leaveHoverOption}
                          text="Try again"
                          icon={faRefresh}
                          hoveredPrompt={hoveredPrompt?.id ?? null}
                          hoveredOption={hoveredOption}
                          chat={chat}
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>

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
                    chat.isError
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
                    {chat.response}
                  </ReactMarkdown>
                </div>
              </div>

              <div
                onMouseEnter={() => handleOnhoverPrompt(chat.id, "response")}
                onMouseLeave={() => handleLeaveHoverPrompt()}
                className={`flex gap-1 items-center sm:ml-11 -mt-2`}
              >
                <div onClick={() => handleCopyMessage(chat.response)}>
                  <Option
                    onHover={onHoverOption}
                    onLeave={leaveHoverOption}
                    text={isCopied ? "Copied" : "Copy Message"}
                    icon={
                      isCopied && hoveredPrompt?.id === chat.id
                        ? faCheck
                        : faCopy
                    }
                    hoveredPrompt={hoveredPrompt?.id ?? null}
                    hoveredOption={hoveredOption}
                    chat={chat}
                  />
                </div>
                <div>
                  <Option
                    onHover={onHoverOption}
                    onLeave={leaveHoverOption}
                    text="Resend"
                    icon={faRefresh}
                    hoveredPrompt={hoveredPrompt?.id ?? null}
                    hoveredOption={hoveredOption}
                    chat={chat}
                  />
                </div>
              </div>
            </motion.div>
          </>
        ))}
      </div>

      {openImage && selectedImage && (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-black/70 z-50">
          <div className="h-full flex justify-center items-center relative">
            <motion.img
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[70%] max-w-[80%] object-contain"
              src={selectedImage}
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
      )}

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
