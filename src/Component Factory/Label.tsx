const Label = ({ condition, text }: { condition: boolean; text: string }) => {
  return (
    <div
      className={`text-xs bg-white text-[#282A2C] px-2 py-1 rounded ${
        condition
          ? "opacity-100 translate-0 scale-100"
          : "opacity-0 translate-y-1.5 scale-75"
      } transition pointer-events-none`}
    >
      {text}
    </div>
  );
};

export default Label;
