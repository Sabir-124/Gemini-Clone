import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeminiModal } from "../data/geminiModels";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useUIStore } from "../stores/uiStore";

export let model = "flash";

const AiModelModal = () => {
  const handleModal = (modal: string) => {
    model = modal;
  };

  const setModelOpen = useUIStore((state) => state.setModelOpen);
  return (
    <>
      <div className="text-[#bbbfc1]">Choose your model</div>
      <div className="flex flex-col gap-1">
        {GeminiModal.map((modal, index) => (
          <div
            key={index}
            onClick={() => {
              handleModal(modal.name);
              setModelOpen(false);
            }}
            className="hover:bg-[#545657] rounded-md px-3 py-2 flex justify-between items-center"
          >
            <div>
              <div className="text-white">{modal.description}</div>
              <div className="text-[#bbbfc1] text-xs">2.5 {modal.name}</div>
            </div>
            {model === modal.name && (
              <div>
                <FontAwesomeIcon color="white" icon={faCheckCircle} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default AiModelModal;
