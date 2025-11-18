import { useEffect, useState } from "react";

const ImagePreview = ({ file }: { file: File }) => {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    };
    loadImage();
  }, [file]);

  if (!imgSrc) return null;

  return (
    <>
      <div>
        <img
          loading="lazy"
          className="h-30 w-auto rounded-lg object-cover bg-[#434648] cursor-pointer"
          src={imgSrc}
          alt="Upload preview"
        />
      </div>
    </>
  );
};

export default ImagePreview;
