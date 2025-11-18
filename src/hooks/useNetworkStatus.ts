import { useEffect } from "react";
import { useSystemStore } from "../stores/systemStore";

export const useNetworkStatus = () => {
  const { setIsOnline, setOfflineMsg } = useSystemStore();

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setOfflineMsg(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineMsg(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline, setOfflineMsg]);
};
