import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import BacksideDark from "./BacksideDark";
import AiModelModal from "../Component Factory/AiModelModal";
import AlertModal from "../Component Factory/AlertModal";
import { useSystemStore } from "../stores/systemStore";
import { useUIStore } from "../stores/uiStore";
import FileModal from "../Component Factory/FileModal";

interface GeminiProps {
  children: [ReactNode, ReactNode];
  sidebarWeight: number;
}

const Gemini = ({ children, sidebarWeight }: GeminiProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sidebar, mainContent] = children;
  const sidebarWidth = `${sidebarWeight}rem`;

  const offlineMsg = useSystemStore((state) => state.offlineMsg);
  const setOfflineMsg = useSystemStore((state) => state.setOfflineMsg);
  const isLgScreen = useSystemStore((state) => state.isLgScreen);
  const setisLgScreen = useSystemStore((state) => state.setisLgScreen);
  const imageError = useSystemStore((state) => state.imageError);
  const setImageError = useSystemStore((state) => state.setImageError);

  const hideBar = useUIStore((state) => state.hideBar);
  const setHideBar = useUIStore((state) => state.setHideBar);
  const isModelOpen = useUIStore((state) => state.isModelOpen);
  const isFileModalOpen = useUIStore((state) => state.isFileModalOpen);

  useNetworkStatus();

  useEffect(() => {
    const handleResize = () => {
      setisLgScreen(window.innerWidth >= 1024);
      setHideBar(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Sidebar */}

      <motion.div
        className="fixed top-0 lg:left-0 -left-full h-screen z-50"
        animate={{
          width: isLgScreen ? sidebarWidth : "80vw",
          left: !hideBar ? "0%" : "",
        }}
      >
        {sidebar}
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-y-auto overflow-x-hidden -z-20"
        animate={{
          paddingLeft: isLgScreen ? sidebarWidth : 0,
        }}
      >
        {mainContent}
      </motion.div>

      {/* Offline Message */}
      <AlertModal
        text={"Your device is currently offline!"}
        isCondition={offlineMsg}
        setCondition={setOfflineMsg}
      />

      {/* image error message */}
      <AlertModal
        text="Sorry, this version can't generate images."
        isCondition={imageError}
        setCondition={setImageError}
      />

      {/* AI model modal */}
      <div
        className={`fixed left-0 right-0 w-screen flex flex-col gap-4 bg-[#353739] p-4 rounded-t-lg z-50 ${
          (!isLgScreen && !isModelOpen) || isLgScreen
            ? "-bottom-full delay-100"
            : "bottom-0 delay-400"
        } transition-all`}
      >
        <AiModelModal />
      </div>

      {/* File upload modal */}
      <FileModal fileInputRef={fileInputRef} />

      {/* when sidebar is opened */}
      {(!hideBar ||
        (isModelOpen && !isLgScreen) ||
        (isFileModalOpen && !isLgScreen)) && <BacksideDark />}
    </div>
  );
};

export default Gemini;
