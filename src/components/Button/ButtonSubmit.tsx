interface ButtonSubmitProps {
  onClick?: () => void;
  title?: string;
  disabled: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

function ButtonSubmit({ onClick, title, disabled, children, isLoading }: ButtonSubmitProps) {
  const isActive = !disabled && !isLoading;

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={!isActive}
      className={` w-1/2 text-white px-4 py-2 rounded-md ${
        isActive ? `bg-green-700 hover:bg-green-600` : `bg-slate-500`
      }`}
    >
      {isLoading ? 'Loading...' : title || children}
    </button>
  );
}

export default ButtonSubmit;
