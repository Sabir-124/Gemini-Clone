import "./App.css";
import Gemini from "./components/Gemini";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import { useUIStore } from "./stores/uiStore";

const App = () => {
  const { hideSidebar } = useUIStore();
  return (
    <Gemini sidebarWeight={hideSidebar ? 20 : 5}>
      <Sidebar />
      <MainContent />
    </Gemini>
  );
};

export default App;
