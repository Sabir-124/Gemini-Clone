import {
  faBars,
  faMessage,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconFactory from "../Component Factory/IconFactory";
import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Label from "../Component Factory/Label";
import { useUIStore } from "../stores/uiStore";
import { useChatStore, type currentChatProps } from "../stores/chatStore";
import { useInputStore } from "../stores/inputStore";

const Sidebar = memo(() => {
  // chat store
  const currentChat = useChatStore((state) => state.currentChat);
  const allChat = useChatStore((state) => state.allChat);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const clearCurrentChat = useChatStore((state) => state.clearCurrentChat);
  const setCurrentId = useChatStore((state) => state.setCurrentId);

  // UI Store
  const hideSidebar = useUIStore((state) => state.hideSidebar);
  const hideBar = useUIStore((state) => state.hideBar);
  const menuText = useUIStore((state) => state.menuText);
  const setRender = useUIStore((state) => state.setRender);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);
  const setHideBar = useUIStore((state) => state.setHideBar);
  const setBar = useUIStore((state) => state.setBar);
  const setIsSearchOpen = useUIStore((state) => state.setIsSearchOpen);
  const setMenuText = useUIStore((state) => state.setMenuText);

  // Input Store
  const isLoading = useInputStore((state) => state.isLoading);
  const isTemporaryMsg = useInputStore((state) => state.isTemporaryMsg);
  const setTemporaryMsg = useInputStore((state) => state.setTemporaryMsg);
  const setPromptCall = useInputStore((state) => state.setPromptCall);

  const [showText, setShowText] = useState(false);
  const [tempText, setTempText] = useState(false);
  const [newchatText, setNewchatText] = useState(false);
  const [searchText, setSearchText] = useState(false);

  const handleNewchatButton = useCallback(() => {
    setRender(true);
    setIsChatOpen(false);
    setIsSearchOpen(false);
    setBar(true);
    setTemporaryMsg(false);
    setPromptCall("");
    if (currentChat.length === 0) {
      setShowText(true);
      setTimeout(() => {
        setShowText(false);
      }, 1200);
    } else {
      setCurrentChat([]);
      clearCurrentChat();
    }
  }, [
    currentChat.length,
    setRender,
    setIsChatOpen,
    setIsSearchOpen,
    setBar,
    setTemporaryMsg,
    setCurrentChat,
    setPromptCall,
    clearCurrentChat,
  ]);

  const handleSelectedChat = useCallback(
    (chat: currentChatProps[], chatId: number) => {
      setCurrentChat(chat);
      setRender(false);
      setIsChatOpen(true);
      setCurrentId(chatId);
      setIsSearchOpen(false);
      setBar(true);
      setTemporaryMsg(false);
      setPromptCall("");
    },
    [
      setCurrentChat,
      setRender,
      setIsChatOpen,
      setCurrentId,
      setIsSearchOpen,
      setBar,
      setTemporaryMsg,
      setPromptCall,
    ]
  );

  const handleSearchButton = useCallback(() => {
    setIsSearchOpen(true);
    setRender(false);
    setIsChatOpen(false);
    setBar(true);
    setPromptCall("");
  }, [setIsSearchOpen, setRender, setIsChatOpen, setBar, setPromptCall]);

  const handleBarButton = useCallback(() => {
    if (!hideBar) {
      setBar(true);
    } else {
      setHideBar(!hideSidebar);
    }
  }, [hideBar, hideSidebar, setBar, setHideBar]);

  const handleTemporaryMsgButton = useCallback(() => {
    setTemporaryMsg(!isTemporaryMsg);
    setBar(true);
    setCurrentChat([]);
    setRender(true);
    setIsSearchOpen(false);
    setPromptCall("");
  }, [
    isTemporaryMsg,
    setTemporaryMsg,
    setBar,
    setCurrentChat,
    setRender,
    setPromptCall,
  ]);

  const newchatVariants = {
    hidden: { opacity: 0, y: 2 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="">
      <div className="bg-[#282A2C] text-white flex flex-col h-screen p-4 px-1.5 relative z-50 lg:overflow-x-hidden">
        {/* header */}
        <div
          className={`absolute top-0 left-0 right-0 flex flex-col gap-5 p-5`}
        >
          <div className="flex justify-between items-center top-4 left-3 right-3 transition duration-500 delay-500">
            <div
              onMouseEnter={() => setMenuText(true)}
              onMouseLeave={() => setMenuText(false)}
              onClick={handleBarButton}
              className="relative"
            >
              <IconFactory icon={faBars} />
              <div
                className={`absolute -bottom-[85%] w-max pointer-events-none ${
                  !hideSidebar ? "left-1/2 -translate-x-1/2" : ""
                }`}
              >
                <Label
                  condition={menuText}
                  text={`${!hideSidebar ? "Open" : "Collapse"} Menu`}
                />
              </div>
            </div>
            <button
              onClick={handleSearchButton}
              className={`relative ${
                hideSidebar ? "opacity-100 block" : "opacity-0 hidden"
              } transition-all`}
              onMouseEnter={() => setSearchText(true)}
              onMouseLeave={() => setSearchText(false)}
            >
              <IconFactory icon={faSearch} />
              <div className="absolute -left-[150%] top-1/2 -translate-y-1/3 w-max pointer-events-none">
                <Label condition={searchText} text="Search" />
              </div>
            </button>
          </div>

          {/* New chat buttons */}
          <div className="flex items-center gap-3">
            <button
              className="relative flex-1"
              onClick={handleNewchatButton}
              disabled={isLoading}
              onMouseEnter={() => setNewchatText(true)}
              onMouseLeave={() => setNewchatText(false)}
            >
              {hideSidebar && showText && (
                <motion.div
                  variants={newchatVariants}
                  initial="hidden"
                  animate={showText ? "visible" : "hidden"}
                  className="absolute -top-full left-[50%] right-[50%] -translate-x-1/2 w-max bg-[#3E4042] rounded-full py-2 px-5 transition text-xs"
                >
                  You are already in new chat
                </motion.div>
              )}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[90%] w-max pointer-events-none">
                <Label condition={newchatText} text="New Chat" />
              </div>
              <div
                className={`flex items-center gap-3 hover:bg-white/20 ${
                  hideSidebar ? "px-4" : "px-2.5"
                } py-2 rounded-full transition duration-75 w-full ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div>
                  <FontAwesomeIcon
                    color={currentChat.length === 0 ? "gray" : "white"}
                    icon={faPlus}
                  />
                </div>
                <span
                  className={`truncate ${
                    currentChat.length === 0 ? "text-[#757575]" : "text-white"
                  } ${
                    hideSidebar ? "flex opacity-100" : "hidden opacity-0"
                  } transition-all`}
                >
                  New Chat
                </span>
              </div>
            </button>
            <button
              onMouseEnter={() => setTempText(true)}
              onMouseLeave={() => setTempText(false)}
              onClick={handleTemporaryMsgButton}
              className={`${
                isTemporaryMsg
                  ? "bg-[#2D4368] hover:bg-[#3d5989]"
                  : "hover:bg-[#404244]"
              } ${
                hideSidebar ? "opacity-100" : "opacity-0"
              } w-9 h-9 flex justify-center items-center rounded-full cursor-pointer transition relative border border-white border-dashed`}
            >
              <FontAwesomeIcon icon={faMessage} />
              <div className="absolute -bottom-full -right-1 w-max pointer-events-none">
                <Label condition={tempText} text="Temporary chat" />
              </div>
            </button>
          </div>
        </div>

        {/* all chats */}
        <div
          className={`${
            hideSidebar ? "opacity-100" : "opacity-0"
          } mt-30 transition-all duration-300`}
        >
          {allChat.length > 0 && (
            <>
              <div className="mb-5 ml-2 text-white/70">Recents</div>
              <div className="scroll-y-auto flex flex-col gap-1">
                {allChat.map((chat) => (
                  <motion.div
                    variants={newchatVariants}
                    initial="hidden"
                    animate={chat ? "visible" : "hidden"}
                    key={chat.id}
                    className={`flex justify-between items-center gap-3 cursor-pointer px-4 py-2 rounded-full transition ${
                      currentChat.length > 0 &&
                      currentChat[0].prompt === chat.messages[0].prompt
                        ? "bg-blue-950"
                        : "hover:bg-[#494C4F]"
                    } `}
                    onClick={() => handleSelectedChat(chat.messages, chat.id)}
                  >
                    <span className="truncate">{chat.messages[0].prompt}</span>
                    <div className="text-xs flex gap-2 text-[#86888a]">
                      <span>{chat.daystamp}</span>
                      <span>{chat.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
