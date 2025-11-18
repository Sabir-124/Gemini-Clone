import {
  faArrowLeft,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import { useChatStore, type currentChatProps } from "../stores/chatStore";
import { useUIStore } from "../stores/uiStore";
import { useInputStore } from "../stores/inputStore";
import { useSystemStore } from "../stores/systemStore";

const RecentSearches = () => {
  const allChat = useChatStore((state) => state.allChat);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const setCurrentId = useChatStore((state) => state.setCurrentId);
  const currentChat = useChatStore((state) => state.currentChat);

  const setRender = useUIStore((state) => state.setRender);
  const setIsSearchOpen = useUIStore((state) => state.setIsSearchOpen);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);

  const setTemporaryMsg = useInputStore((state) => state.setTemporaryMsg);
  const isLgScreen = useSystemStore((state) => state.isLgScreen);

  const handleSelectedChat = useCallback(
    (chat: currentChatProps[], chatId: number) => {
      setCurrentChat(chat);
      setRender(false);
      setIsChatOpen(true);
      setCurrentId(chatId);
      setIsSearchOpen(false);
      setTemporaryMsg(false);
    },
    [
      setCurrentChat,
      setRender,
      setIsChatOpen,
      setCurrentId,
      setIsSearchOpen,
      setTemporaryMsg,
    ]
  );

  const handleCrossButton = () => {
    setIsChatOpen(true);
    setIsSearchOpen(false);
    if (currentChat.length === 0) {
      setRender(true);
    }
  };

  const [search, setSearch] = useState("");

  const resultChat = useMemo(() => {
    if (search === "") {
      return allChat;
    }
    return allChat.filter((chat) =>
      chat.messages[0].prompt.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allChat]);

  return (
    <div className="flex flex-col gap-8">
      <div className="hidden lg:flex justify-between items-center">
        <div className="text-2xl lg:text-3xl">Search</div>
        <div className="cursor-pointer" onClick={handleCrossButton}>
          <FontAwesomeIcon size={isLgScreen ? "2x" : "1x"} icon={faXmark} />
        </div>
      </div>
      <div className="flex items-center gap-5 px-4 py-2 border border-[#414346] rounded-full">
        {isLgScreen ? (
          <div>
            <FontAwesomeIcon color="gray" icon={faSearch} />
          </div>
        ) : (
          <div onClick={handleCrossButton}>
            <FontAwesomeIcon color="gray" icon={faArrowLeft} />
          </div>
        )}
        <input
          className="focus:outline-none w-full"
          type="text"
          placeholder="Search for chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        {allChat.length === 0 ? (
          <div className="text-center lg:mt-5">No recent chats</div>
        ) : (
          allChat.length > 0 && (
            <>
              <div className="mb-5 ml-2 text-white/70">Recents</div>
              <div className="scroll-y-auto flex flex-col gap-1">
                {resultChat.length === 0 ? (
                  <div className="text-center mt-5">No recent chats</div>
                ) : (
                  resultChat.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex justify-between items-center cursor-pointer px-4 py-3 border-b border-b-[#3e3f40] rounded-lg rounded-b-none transition hover:bg-[#3e3f40]"
                      onClick={() => handleSelectedChat(chat.messages, chat.id)}
                    >
                      <span className="truncate">
                        {chat.messages[0].prompt}
                      </span>
                      <div className="text-xs flex gap-2 text-[#86888a]">
                        <span>{chat.daystamp}</span>
                        <span>{chat.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default RecentSearches;
