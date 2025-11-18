import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface AlertModalProps {
  text: string;
  isCondition: boolean;
  setCondition: (bool: boolean) => void;
}

const AlertModal = ({ text, isCondition, setCondition }: AlertModalProps) => {
  return (
    <motion.div
      initial={{ y: "-250%" }}
      animate={{ y: isCondition ? 0 : "-250%" }}
      className="absolute top-7 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="relative flex items-center gap-4 bg-red-500 text-white px-5 py-3 rounded-lg overflow-hidden">
        <div>{text}</div>
        <div className="cursor-pointer" onClick={() => setCondition(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <motion.div
          animate={{ x: isCondition ? "100%" : 0 }}
          transition={{ duration: 5 }}
          className="absolute w-full h-1 bg-white bottom-0 -left-full"
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default AlertModal;
