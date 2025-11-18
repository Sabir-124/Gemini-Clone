const Label = ({ condition, text }: { condition: boolean; text: string }) => {
  return (
    <div
      className={`text-xs bg-white text-gray-700 font-semibold px-2 py-1 rounded ${
        condition
          ? "opacity-100 -translate-y-1 scale-100"
          : "opacity-0 translate-y-0 scale-75"
      } transition`}
    >
      {text}
    </div>
  );
};

export default Label;
