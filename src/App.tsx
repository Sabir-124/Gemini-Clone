import { useEffect } from "react";
import "./App.css";
import Gemini from "./components/Gemini";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import { useUIStore } from "./stores/uiStore";

const App = () => {
  // useEffect(() => {
  //   const handler = (e: MouseEvent) => e.preventDefault();
  //   document.addEventListener("contextmenu", handler);
  //   return () => document.removeEventListener("contextmenu", handler);
  // }, []);

  const { hideSidebar } = useUIStore();
  return (
    <Gemini sidebarWeight={hideSidebar ? 20 : 5}>
      <Sidebar />
      <MainContent />
    </Gemini>
  );
};

export default App;
