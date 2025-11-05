type ButtonParams = {
  text: string;
  disabled?: boolean;
  className?: string;
};

const Button = ({ text, disabled, className }: ButtonParams) => {
  return (
    <button
      disabled={disabled}
      className={`w-full rounded border border-black bg-black py-2 text-white transition-all duration-300 enabled:cursor-pointer enabled:hover:border-black enabled:hover:bg-white enabled:hover:text-black ${className || ""}`}
    >
      {text}
    </button>
  );
};

export default Button;
