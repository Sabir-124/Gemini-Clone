import SearchArea from "./SearchArea";
import { motion } from "framer-motion";
import FixedParts from "./FixedParts";
import Chats from "./Chats";
import RecentSearches from "./RecentSearches";
import { faArrowDown, faBars } from "@fortawesome/free-solid-svg-icons";
import IconFactory from "../Component Factory/IconFactory";
import { useUIStore } from "../stores/uiStore";
import { useChatStore } from "../stores/chatStore";
import { useInputStore } from "../stores/inputStore";
import { useSystemStore } from "../stores/systemStore";
import {
  Activity,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import StarredMessages from "./StarredMessages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MainContent = () => {
  const render = useUIStore((state) => state.render);
  const setRender = useUIStore((state) => state.setRender);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);
  const setIsSearchOpen = useUIStore((state) => state.setIsSearchOpen);
  const hideSidebar = useUIStore((state) => state.hideSidebar);
  const setHideBar = useUIStore((state) => state.setHideBar);
  const hideBar = useUIStore((state) => state.hideBar);
  const setBar = useUIStore((state) => state.setBar);
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const isChatOpen = useUIStore((state) => state.isChatOpen);
  const isStarredMessagesOpen = useUIStore(
    (state) => state.isStarredMessagesOpen
  );
  const setStarredMessagesOpen = useUIStore(
    (state) => state.setStarredMessagesOpen
  );

  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const clearCurrentChat = useChatStore((state) => state.clearCurrentChat);
  const currentChat = useChatStore((state) => state.currentChat);
  const allChat = useChatStore((state) => state.allChat);
  const loadingPrompt = useChatStore((state) => state.loadingPrompt);

  const isLoading = useInputStore((state) => state.isLoading);
  const setTemporaryMsg = useInputStore((state) => state.setTemporaryMsg);

  const isLgScreen = useSystemStore((state) => state.isLgScreen);
  const scroll = useSystemStore((state) => state.scroll);

  const handleNewchatButton = useCallback(() => {
    setRender(true);
    setIsChatOpen(false);
    setIsSearchOpen(false);
    setTemporaryMsg(false);
    setStarredMessagesOpen(false);
    if (currentChat.length > 0) {
      setCurrentChat([]);
      clearCurrentChat();
    }
  }, [
    setIsChatOpen,
    setRender,
    setIsSearchOpen,
    setTemporaryMsg,
    setCurrentChat,
    clearCurrentChat,
    currentChat.length,
    setStarredMessagesOpen,
  ]);

  const handleSidebarToggle = useCallback(() => {
    setBar(!hideBar);
    setHideBar(true);
  }, [setBar, setHideBar]);

  const headerAnimation = useMemo(
    () => ({
      left: !isLgScreen ? 0 : hideSidebar ? "20rem" : "5rem",
    }),
    [isLgScreen, hideSidebar]
  );

  const searchAreaAnimation = useMemo(
    () => ({
      opacity:
        (!render && !isSearchOpen && !isStarredMessagesOpen) ||
        (!isLgScreen && !isSearchOpen && !isStarredMessagesOpen)
          ? 1
          : 0,
      display:
        (!render && !isSearchOpen && !isStarredMessagesOpen) ||
        (!isLgScreen && !isSearchOpen && !isStarredMessagesOpen)
          ? "flex"
          : "none",
    }),
    [render, isSearchOpen, isLgScreen, isStarredMessagesOpen]
  );

  const searchAreaTransition = useMemo(
    () =>
      !render && !isSearchOpen && !isStarredMessagesOpen ? { delay: 0.5 } : {},
    [render, isSearchOpen, isStarredMessagesOpen]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  const [isAtBottom, setAtBottom] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10;
      setAtBottom(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scroll]);

  useEffect(() => {
    console.log("Current chat", currentChat);
    console.log("All chat", allChat);
    console.log("=======================");
  }, [currentChat, allChat]);

  return (
    <div className="relative">
      {/* fixed parts */}
      <Activity mode={render ? "visible" : "hidden"}>
        <div
          className={`w-full absolute top-1/3 -translate-y-1/2 text-white transition`}
        >
          <FixedParts />
        </div>
      </Activity>

      <div
        className={`bg-[#1B1C1D] text-white h-screen flex flex-col w-full overflow-x-hidden`}
      >
        {/* header */}
        <motion.div
          className={`fixed top-0 right-0 h-16 flex px-3 items-center gap-3 bg-[#1B1C1D] upBlackShadow`}
          animate={headerAnimation}
        >
          <div className="lg:hidden" onClick={handleSidebarToggle}>
            <IconFactory icon={faBars} />
          </div>
          <div
            className="text-xl text-[#C4C7C5] font-semibold cursor-pointer"
            onClick={handleNewchatButton}
          >
            Gemini
          </div>
        </motion.div>

        {/* Chats and recent searches */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto pt-4 mb-15 chat-scrollbar"
        >
          <Activity mode={isSearchOpen ? "visible" : "hidden"}>
            <div
              className={`flex justify-center items-center px-4 transition delay-500`}
            >
              <div className="w-full max-w-[650px]">
                <RecentSearches />
              </div>
            </div>
          </Activity>

          <Activity mode={isStarredMessagesOpen ? "visible" : "hidden"}>
            <div
              className={`flex justify-center items-center px-4 transition delay-500`}
            >
              <div className="w-full max-w-[650px]">
                <StarredMessages />
              </div>
            </div>
          </Activity>

          <Activity mode={isChatOpen ? "visible" : "hidden"}>
            <div
              className="flex justify-center items-center px-4"
              style={{
                paddingBottom: isLoading ? `50vh` : "0",
              }}
            >
              <div className="w-full max-w-[800px]">
                <Chats />
                <div
                  className={`flex flex-col gap-1 ${
                    isLoading
                      ? "opacity-100 flex"
                      : "opacity-0 hidden pointer-events-none"
                  } ${currentChat.length > 0 ? "mt-10" : ""} transition-all`}
                >
                  <pre className="self-end bg-[#282A2C] px-5 py-3 rounded-3xl rounded-tr-md max-w-[80%] mb-4 font-sans overflow-x-auto">
                    {loadingPrompt}
                  </pre>
                  <div className="flex gap-5 items-start flex-1 overflow-hidden wrap-break-word">
                    <img
                      loading="lazy"
                      src="/Gemini-Clone/icons/gemini.png"
                      alt="web-icon"
                      className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`}
                    />
                    <div className="text-[#72787d]">
                      Wait a moment. Generating response . . . .
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Activity>
        </div>

        {/* Sticky bottom search */}
        <motion.div
          animate={searchAreaAnimation}
          transition={searchAreaTransition}
          className={`sticky bottom-15 w-full flex flex-col items-center gap-3 py-3 bg-[#1B1C1D] BlackShadow`}
        >
          <div
            className={`flex flex-col gap-2 w-full max-w-[800px] px-4 ${
              isLoading ? "pointer-events-none" : ""
            }`}
          >
            <div>
              <SearchArea />
            </div>
            <motion.div
              animate={{ display: isChatOpen ? "block" : "none" }}
              className="text-center w-full text-xs"
            >
              Gemini can make mistakes, so double-check it.
            </motion.div>
          </div>
        </motion.div>

        <div
          onClick={scrollToBottom}
          className={`absolute bottom-58 left-1/2 -translate-x-1/2 flex justify-center items-center rounded-full w-9 h-9 bg-[#282A2C] hover:bg-[#404345] cursor-pointer transition ${
            isAtBottom || currentChat.length === 0
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
