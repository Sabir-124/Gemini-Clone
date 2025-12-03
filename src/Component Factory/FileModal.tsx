import { useCallback, type ChangeEvent, type RefObject } from "react";
import { supportedFiles } from "../data/supportedFiles";
import { useFileStore } from "../stores/fileStore";
import { useUIStore } from "../stores/uiStore";
import { useSystemStore } from "../stores/systemStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faFile,
  faImage,
  faPaperclip,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const FileModal = ({
  fileInputRef,
  modalRef,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  modalRef?: RefObject<HTMLDivElement | null>;
  inputId?: string; // Optional prop for unique IDs
}) => {
  const setFile = useFileStore((state) => state.setFile);
  const setFileImage = useFileStore((state) => state.setFileImage);
  const setVisible = useFileStore((state) => state.setVisible);
  const setFilePreview = useFileStore((state) => state.setFilePreview);
  const setFileMsg = useFileStore((state) => state.setFileMsg);
  const setSizeError = useFileStore((state) => state.setSizeError);
  const setFileModalOpen = useUIStore((state) => state.setFileModalOpen);
  const isFileModalOpen = useUIStore((state) => state.isFileModalOpen);
  const isLgScreen = useSystemStore((state) => state.isLgScreen);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];

      const MAX_FILE_SIZE = 30 * 1024 * 1024;

      if (selectedFile && selectedFile?.size < MAX_FILE_SIZE) {
        const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

        supportedFiles.some((file) => {
          if (fileExtension && file.file === fileExtension) {
            setFileImage(file.icon);
            setVisible(false);
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
              setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
          }
        });

        if (
          fileExtension &&
          !supportedFiles.some((file) => file.file.includes(fileExtension))
        ) {
          setFileMsg(fileExtension);
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 3500);
        }
      } else {
        setSizeError(true);
        setTimeout(() => {
          setSizeError(false);
        }, 3500);
      }

      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFileModalOpen(false);
    },
    [
      setFile,
      setFileImage,
      setFilePreview,
      setFileMsg,
      setVisible,
      setSizeError,
      fileInputRef,
      setFileModalOpen,
    ]
  );

  return (
    <div>
      {isLgScreen ? (
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#1B1C1D] absolute -top-[135%] w-max border-2 border-[#6d7171] rounded-xl p-0.5 ${
            isLgScreen && isFileModalOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          } transition`}
        >
          <label htmlFor="LgScreenFileUpload" className="cursor-pointer">
            <div className="flex items-center gap-3 bg-[#1B1C1D] hover:bg-[#6d7171] p-3 py-2 rounded-lg transition">
              <FontAwesomeIcon icon={faPaperclip} />
              <div>Upload File or Image</div>
            </div>
          </label>
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            id="LgScreenFileUpload"
            className="hidden pointer-events-none"
          />
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed left-0 right-0 flex flex-col gap-8 bg-[#353739] p-4 rounded-t-lg z-50 text-white ${
            (!isLgScreen && !isFileModalOpen) || isLgScreen
              ? "-bottom-full delay-100"
              : "bottom-0 delay-400"
          } transition-all`}
        >
          <div className="flex justify-between">
            <div className="text-lg">Choose to upload</div>
            <div
              onClick={() => setFileModalOpen(false)}
              className="cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div>
            <div className="max-w-100 flex items-center gap-4 m-auto text-center">
              <label
                htmlFor="fileUpload"
                className="flex-1 border-2 rounded-lg py-3 hover:bg-[#535558] transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faFile} />
                <div>File</div>
              </label>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                accept="*/*"
                id="fileUpload"
                className="hidden pointer-events-none"
              />

              <label
                htmlFor="imageUpload"
                className="flex-1 border-2 rounded-lg py-3 hover:bg-[#535558] transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faImage} />
                <div>Image</div>
              </label>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden pointer-events-none"
              />

              <label
                htmlFor="cameraUpload"
                className="flex-1 border-2 rounded-lg py-3 hover:bg-[#535558] transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faCamera} />
                <div>Camera</div>
              </label>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                id="cameraUpload"
                accept="image/*"
                capture="environment"
                className="hidden pointer-events-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileModal;
