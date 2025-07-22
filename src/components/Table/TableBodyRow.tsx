interface TableBodyRowProps {
  key: string;
  onDoubleClick?: (selectedRow: any) => void;
  children: React.ReactNode;
}

function TableBodyRow({ key, onDoubleClick, children }: TableBodyRowProps) {
  return (
    <tr key={key} className="hover:bg-gray-700" onDoubleClick={onDoubleClick}>
      {children}
    </tr>
  );
}

export default TableBodyRow;
