function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex-1 overflow-auto border rounded 
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar]:h-2 
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-transparent
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
    >
      {children}
    </div>
  );
}

export default TableContainer;
