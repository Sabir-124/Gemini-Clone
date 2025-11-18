import { motion } from "framer-motion";
import { useUIStore } from "../stores/uiStore";
import { useCallback } from "react";

const BacksideDark = () => {
  const hideBar = useUIStore((state) => state.hideBar);
  const setBar = useUIStore((state) => state.setBar);
  const isModelOpen = useUIStore((state) => state.isModelOpen);
  const setModelOpen = useUIStore((state) => state.setModelOpen);

  const handleBackground = useCallback(() => {
    setBar(true);
    setModelOpen(false);
  }, []);

  return (
    <motion.div
      animate={{
        backgroundColor:
          !hideBar || isModelOpen ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: 0.3, delay: !hideBar ? 0 : 0.3 }}
      onClick={handleBackground}
      className={`fixed top-0 left-0 right-0 h-screen flex-1 ${
        !hideBar || isModelOpen
          ? "bg-[rgba(0, 0, 0, 0.5)]"
          : "bg-[rgba(0, 0, 0, 0)]"
      } transition-all`}
    ></motion.div>
  );
};

export default BacksideDark;
