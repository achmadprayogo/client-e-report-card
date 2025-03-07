interface ToolbarItemProps {
  icon: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function ToolbarItem({ icon, children, onClick }: ToolbarItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="flex items-center px-4 py-2 text-white border rounded-lg hover:bg-gray-700 h-10 "
    >
      <span className="material-symbols-outlined me-2">{icon}</span>
      {children}
    </button>
  );
}

export default ToolbarItem;
