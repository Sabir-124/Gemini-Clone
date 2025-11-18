import { useEffect, useMemo, useRef, useState } from "react";
import SearchArea from "./SearchArea";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useInputStore } from "../stores/inputStore";

const Tags = ["Write", "Build", "DeepSearch", "Learn"];

const FixedParts = () => {
  const setPromptCall = useInputStore((state) => state.setPromptCall);
  const isTemporaryMsg = useInputStore((state) => state.isTemporaryMsg);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [timePeriod, setTimePeriod] = useState("");

  const handleTags = (tag: string) => {
    setPromptCall(tag);
    inputRef.current?.focus();
  };

  const greetingVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 2 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.8 },
    }),
    []
  );

  const tagsAnimation = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: isTemporaryMsg ? 0 : 1 },
    }),
    []
  );

  useEffect(() => {
    const time = new Date();
    const hour = time.getHours();

    if (hour >= 6 && hour < 12) {
      setTimePeriod("Morning");
    } else if (hour >= 12 && hour < 17) {
      setTimePeriod("Afternoon");
    } else if (hour >= 17 && hour < 20) {
      setTimePeriod("Evening");
    } else if (hour >= 20 && hour <= 23) {
      setTimePeriod("Night");
    } else {
      setTimePeriod("Night");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      {!isTemporaryMsg ? (
        <>
          <motion.div
            {...greetingVariants}
            className="bg-linear-to-r from-blue-500 to-white bg-clip-text text-transparent text-2xl lg:text-4xl font-semibold flex flex-col items-center text-center"
          >
            <div>Hello & Good {timePeriod}.</div>
            <div>How may I help you today?</div>
          </motion.div>

          <div className="hidden lg:block w-full max-w-[800px]">
            <div className="px-4">
              <SearchArea inputRef={inputRef} />
            </div>
          </div>

          <motion.ul
            {...tagsAnimation}
            className={`sm:flex hidden gap-2 ${
              isTemporaryMsg ? "pointer-events-none" : ""
            }`}
          >
            {Tags.map((tag: string, index) => (
              <li
                onClick={() => handleTags(tag)}
                key={index}
                className="bg-[#353739] hover:bg-[#494c4f] p-3 px-5 cursor-pointer rounded-full transition"
              >
                {tag}
              </li>
            ))}
          </motion.ul>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 items-center px-15 ">
            <div className="w-15 h-15 flex justify-center items-center rounded-full bg-[#282A2C]">
              <FontAwesomeIcon size="2x" icon={faMessage} />
            </div>
            <div className="text-2xl text-[#C4C7C5]">Temporary chat</div>
            <div className="text-center text-[#C4C7C5]">
              Temporary chats don't appear in Recent Chats.
            </div>
          </div>

          <div className="hidden lg:block w-full max-w-[800px]">
            <div className="px-4">
              <SearchArea inputRef={inputRef} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FixedParts;
