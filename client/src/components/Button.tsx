type ButtonParams = {
  text: string;
};

const Button = ({ text }: ButtonParams) => {
  return (
    <button className="w-full cursor-pointer rounded border border-black bg-black py-2 text-white transition-all duration-300 hover:border-black hover:bg-white hover:text-black">
      {text}
    </button>
  );
};

export default Button;
