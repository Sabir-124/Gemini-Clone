import { useEffect, useMemo, useState } from "react";
import SearchArea from "./SearchArea";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useInputStore } from "../stores/inputStore";

const FixedParts = () => {
  const isTemporaryMsg = useInputStore((state) => state.isTemporaryMsg);

  const [timePeriod, setTimePeriod] = useState("");

  const greetingVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 2 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.8 },
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
              <SearchArea />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1 items-center px-15 ">
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
              <SearchArea />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FixedParts;
