import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconProp {
  icon: IconDefinition;
}

const IconFactory = ({ icon }: IconProp) => {
  return (
    <div className="w-10 h-10 rounded-full hover:bg-white/20 flex justify-center items-center cursor-pointer">
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

export default IconFactory;
