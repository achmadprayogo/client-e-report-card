interface ResetButton {
  onClick: () => void;
}
function ResetButton({ onClick }: ResetButton) {
  return (
    <button
      onClick={onClick}
      className="group/reset hover:w-20 text-gray-400 hover:text-yellow-500 hover:bg-gray-600 flex items-center justify-end rounded-full p-1 transition-all "
    >
      <p className="hidden group-hover/reset:inline">reset</p>
      <span className="material-symbols-outlined ms-1">refresh</span>
    </button>
  );
}

export default ResetButton;
