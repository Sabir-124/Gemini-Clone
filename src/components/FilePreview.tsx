import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Activity, useCallback, useState, type RefObject } from "react";
import { useFileStore } from "../stores/fileStore";

const FilePreview = ({
  fileInputRef,
  fileImage,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  fileImage: string | null;
}) => {
  const file = useFileStore((state) => state.file);
  const setFile = useFileStore((state) => state.setFile);
  const filePreview = useFileStore((state) => state.filePreview);

  const [isMarkVisible, setMarkVisible] = useState<boolean>(false);

  const handleXMarkClick = useCallback(() => {
    setFile(null);
    setMarkVisible(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setFile, fileInputRef]);

  return (
    <div
      className="relative w-fit"
      onMouseEnter={() => setMarkVisible(true)}
      onMouseLeave={() => setMarkVisible(false)}
    >
      {file?.type.includes("image") ? (
        <div>
          <img
            loading="lazy"
            className="w-auto object-cover h-15 mb-3 bg-[#434648] rounded-lg"
            src={filePreview ?? undefined}
            alt="image"
          />
        </div>
      ) : (
        file && (
          <div className="min-h-15 bg-[#434648] mb-3 rounded-lg px-3 py-1.5 pr-10 flex flex-col gap-1">
            <div className="text-sm font-semibold">
              {file.name.split(".").shift()}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-auto h-8">
                <img
                  loading="lazy"
                  className="h-full w-full"
                  src={fileImage ?? undefined}
                  alt=""
                />
              </div>
              <div className="text-xs">
                {file.name.split(".").pop()?.toUpperCase()}
              </div>
            </div>
          </div>
        )
      )}

      <Activity mode={isMarkVisible ? "visible" : "hidden"}>
        <div
          onClick={handleXMarkClick}
          className="absolute top-1 right-1 bg-white/30 rounded-full w-6 h-6 flex justify-center items-center cursor-pointer z-50"
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </Activity>
    </div>
  );
};

export default FilePreview;
