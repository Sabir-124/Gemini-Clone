import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { motion } from "framer-motion";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ImagePreview from "./ImagePreview";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useUIStore } from "../stores/uiStore";
import { useChatStore } from "../stores/chatStore";

const Chats = () => {
  // stores
  const openImage = useUIStore((state) => state.openImage);
  const setOpenImage = useUIStore((state) => state.setOpenImage);
  const currentChat = useChatStore((state) => state.currentChat);

  const [selectedImage, setSelectedImage] = useState<string>("");

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
          <motion.div
            variants={newchatVariants}
            initial="hidden"
            animate="visible"
            key={index}
            className="flex flex-col gap-1"
          >
            {chat.file?.type.includes("image") ? (
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
                    {chat.file.name.split(".").shift()}
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
                      {chat.file.name.split(".").pop()?.toUpperCase()}
                    </div>
                  </div>
                </div>
              )
            )}
            {/* User Prompt */}
            <div className="self-end bg-[#282A2C] px-5 py-3 rounded-4xl rounded-tr-md max-w-[80%] mb-4">
              {chat.prompt}
            </div>

            {/* AI Response */}
            <div className="flex gap-5 items-start flex-1 overflow-hidden wrap-break-word">
              <img
                loading="lazy"
                src="/Gemini_Clone/icons/gemini.png"
                alt="web-icon"
                className="w-6 h-6"
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
                    code({ node, inline, className, children, ...props }: any) {
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
          </motion.div>
        ))}
      </div>

      {openImage && selectedImage && (
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/70 z-50">
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
    </>
  );
};

export default Chats;
