interface CloseButton {
  onClick: () => void;
}
function CloseButton({ onClick }: CloseButton) {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-white hover:bg-gray-600 flex items-center justify-center rounded-full p-1 h-fit"
    >
      <span className="material-symbols-outlined">close</span>
    </button>
  );
}

export default CloseButton;
