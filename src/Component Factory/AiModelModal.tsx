import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeminiModal } from "../data/geminiModels";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useUIStore } from "../stores/uiStore";
import { useSystemStore } from "../stores/systemStore";
import type React from "react";
import { Activity } from "react";

const AiModelModal = () => {
  const setSelectedModal = useSystemStore((state) => state.setSelectedModal);
  const selectedModal = useSystemStore((state) => state.selectedModal);
  const setModelOpen = useUIStore((state) => state.setModelOpen);

  const handleModalSelect = (modalName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedModal(modalName);
    setModelOpen(false);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="flex flex-col gap-4"
    >
      <div className="text-[#bbbfc1]">Choose your model</div>
      <div className="flex flex-col gap-1">
        {GeminiModal.map((modal, index) => (
          <div
            key={index}
            onMouseDown={(e) => handleModalSelect(modal.name, e)}
            className="hover:bg-[#545657] rounded-md px-3 py-2 flex justify-between items-center cursor-pointer"
          >
            <div>
              <div className="text-white">{modal.description}</div>
              <div className="text-[#bbbfc1] text-xs">2.5 {modal.name}</div>
            </div>
            <Activity
              mode={selectedModal === modal.name ? "visible" : "hidden"}
            >
              <div>
                <FontAwesomeIcon color="white" icon={faCheckCircle} />
              </div>
            </Activity>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiModelModal;
