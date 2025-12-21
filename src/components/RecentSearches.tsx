import {
  faArrowLeft,
  faSearch,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import {
  useChatStore,
  type ChatSession,
  type EachChatProps,
} from "../stores/chatStore";
import { useUIStore } from "../stores/uiStore";
import { useInputStore } from "../stores/inputStore";
import { useSystemStore } from "../stores/systemStore";

const RecentSearches = () => {
  const allChat = useChatStore((state) => state.allChat);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const setCurrentId = useChatStore((state) => state.setCurrentId);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const currentChat = useChatStore((state) => state.currentChat);
  const starredMessages = useChatStore((state) => state.starredMessages);
  const setStarredMessages = useChatStore((state) => state.setStarredMessages);

  const setRender = useUIStore((state) => state.setRender);
  const setIsSearchOpen = useUIStore((state) => state.setIsSearchOpen);
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);

  const setTemporaryMsg = useInputStore((state) => state.setTemporaryMsg);
  const isLgScreen = useSystemStore((state) => state.isLgScreen);

  const [hoveredRecentId, setHoveredRecentId] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatSession | null>(null);

  const handleSelectedChat = useCallback(
    (chat: EachChatProps[], chatId: string) => {
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
      chat.messages[0].eachChat[0].prompt
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, allChat]);

  const handleHoveredRecentId = (chat: ChatSession | null) => {
    if (chat) {
      setHoveredRecentId(chat?.id);
      setChat(chat);
    } else {
      setHoveredRecentId(null);
      setChat(null);
    }
  };

  const handleDeleteButton = (id: string | undefined) => {
    if (id) {
      deleteChat(id);
      if (chat?.messages[0].id === currentChat[0].id) {
        setCurrentChat([]);
        setRender(true);
        setIsSearchOpen(false);
      }

      const filteredStarredMessages = starredMessages.filter((starredMsg) => {
        return allChat.some((chatSession) => {
          if (chatSession.id === id) return false;
          return chatSession.messages.some((msg) => msg.id === starredMsg.id);
        });
      });

      setStarredMessages(filteredStarredMessages);
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-15">
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
          <div className="cursor-pointer" onClick={handleCrossButton}>
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
                    <div className="flex items-center gap-5 px-4 border-b border-b-[#3e3f40] rounded-lg rounded-b-none transition hover:bg-[#3e3f40]">
                      <div
                        key={chat.id}
                        className="flex flex-1 justify-between items-center cursor-pointer py-3 truncate gap-10"
                        onClick={() =>
                          handleSelectedChat(chat.messages, chat.id)
                        }
                      >
                        <span className="truncate">
                          {chat.messages[0].eachChat[0].prompt
                            .charAt(0)
                            .toUpperCase() +
                            chat.messages[0].eachChat[0].prompt.substring(1)}
                        </span>
                        <div className="text-xs flex gap-2 text-[#86888a]">
                          <span>{chat.daystamp}</span>
                          <span>{chat.timestamp}</span>
                        </div>
                      </div>
                      <div
                        onClick={() => handleDeleteButton(chat.id)}
                        onMouseMove={() => handleHoveredRecentId(chat)}
                        onMouseLeave={() => handleHoveredRecentId(null)}
                        className="flex justify-center items-center "
                      >
                        <button className="w-7 h-7 flex justify-center items-center border border-red-500 rounded cursor-pointer hover:bg-red-500 transition">
                          <FontAwesomeIcon
                            fontSize="0.75rem"
                            color={
                              hoveredRecentId === chat.id ? "white" : "red"
                            }
                            icon={faTrash}
                          />
                        </button>
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
