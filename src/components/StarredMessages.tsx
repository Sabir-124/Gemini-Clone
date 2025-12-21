import {
  faArrowLeft,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Activity, useCallback, useMemo, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import { useUIStore } from "../stores/uiStore";
import { useInputStore } from "../stores/inputStore";
import { useSystemStore } from "../stores/systemStore";

const StarredMessages = () => {
  const starredMessages = useChatStore((state) => state.starredMessages);
  const currentChat = useChatStore((state) => state.currentChat);
  const allChat = useChatStore((state) => state.allChat);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const setCurrentId = useChatStore((state) => state.setCurrentId);
  const setScrollToMessageId = useChatStore(
    (state) => state.setScrollToMessageId
  );
  const setStarredMessages = useChatStore((state) => state.setStarredMessages);

  const setRender = useUIStore((state) => state.setRender);
  const setStarredMessagesOpen = useUIStore(
    (state) => state.setStarredMessagesOpen
  );
  const setIsChatOpen = useUIStore((state) => state.setIsChatOpen);

  const setTemporaryMsg = useInputStore((state) => state.setTemporaryMsg);
  const isLgScreen = useSystemStore((state) => state.isLgScreen);

  const handleSelectedChat = useCallback(
    (messageId: string) => {
      const chatSession = allChat.find((session) =>
        session.messages.some((group) =>
          group.eachChat.some((msg) => msg.id === messageId)
        )
      );

      if (chatSession) {
        setCurrentChat(chatSession.messages);
        setCurrentId(chatSession.id);
        setScrollToMessageId(messageId);
        setRender(false);
        setStarredMessagesOpen(false);
        setTemporaryMsg(false);
        setIsChatOpen(true);
      }
    },
    [
      allChat,
      setCurrentChat,
      setCurrentId,
      setScrollToMessageId,
      setRender,
      setTemporaryMsg,
      setStarredMessagesOpen,
    ]
  );

  const handleCrossButton = () => {
    setStarredMessagesOpen(false);
    if (currentChat.length === 0) {
      setRender(true);
    } else {
      setIsChatOpen(true);
    }
  };

  const [search, setSearch] = useState("");

  const resultChat = useMemo(() => {
    if (search === "") {
      return starredMessages;
    }
    return starredMessages.filter((chat) =>
      chat.prompt.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, starredMessages]);

  const handleStarredDeleteButton = (id: string) => {
    const filteredMsg = starredMessages.filter((msg) => msg.id !== id);
    setStarredMessages(filteredMsg);
  };

  return (
    <div className="flex flex-col gap-8 mb-15">
      <div className="hidden lg:flex justify-between items-center">
        <div className="text-2xl lg:text-3xl">Starred Messages</div>
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
          placeholder="Search for starred messages"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        {starredMessages.length === 0 ? (
          <div className="text-center lg:mt-5">No starred Messages</div>
        ) : (
          <Activity mode={starredMessages.length > 0 ? "visible" : "hidden"}>
            <>
              <div className="mb-5 ml-2 text-white/70">Starred Messages</div>
              <div className="scroll-y-auto flex flex-col gap-1">
                {resultChat.length === 0 ? (
                  <div className="text-center mt-5">No starred Messages</div>
                ) : (
                  resultChat.map((chat) => (
                    <div className="flex items-center gap-10 px-4 border-b border-b-[#3e3f40] rounded-lg rounded-b-none transition hover:bg-[#3e3f40]">
                      <div
                        key={chat.id}
                        className="flex flex-1 justify-between items-center cursor-pointer py-3 truncate"
                        onClick={() => handleSelectedChat(chat.id)}
                      >
                        <span className="truncate">
                          {chat.prompt.charAt(0).toUpperCase() +
                            chat.prompt.substring(1)}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleStarredDeleteButton(chat.id)}
                          className="text-xs text-red-500 px-3 py-1.5 border border-red-500 rounded hover:bg-red-500 hover:text-white transition cursor-pointer z-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          </Activity>
        )}
      </div>
    </div>
  );
};

export default StarredMessages;
