interface DeleteButton {
  onClick: () => void;
}
function DeleteButton({ onClick }: DeleteButton) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/reset hover:w-24 text-gray-400 hover:text-red-700 hover:bg-white flex items-center justify-end rounded-full p-1 transition-all "
    >
      <p className="hidden group-hover/reset:inline">delete!</p>
      <span className="material-symbols-outlined ms-1">delete</span>
    </button>
  );
}

export default DeleteButton;
