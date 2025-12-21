import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Label from "./Label";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { currentChatProps } from "../stores/chatStore";

interface OptionProps {
  onHover: (option: string) => void;
  onLeave: () => void;
  text: string;
  icon: IconDefinition;
  hoveredPrompt: string | null;
  hoveredOption: string | null;
  chat: currentChatProps;
}

const Option = ({
  onHover,
  onLeave,
  text,
  icon,
  hoveredPrompt,
  hoveredOption,
  chat,
}: OptionProps) => {
  return (
    <div
      onMouseEnter={() => onHover(text)}
      onMouseLeave={onLeave}
      className="rounded-md bg-[#282A2C] hover:bg-[#4a4d4f] w-7 h-7 flex items-center justify-center transition cursor-pointer relative"
    >
      <FontAwesomeIcon fontSize={"0.75rem"} icon={icon} />
      <div
        className={`sm:block hidden absolute top-[125%] left-1/2 -translate-x-1/2 w-max pointer-events-none`}
      >
        <Label
          condition={hoveredPrompt === chat.id && hoveredOption === text}
          text={text}
        />
      </div>
    </div>
  );
};

export default Option;
