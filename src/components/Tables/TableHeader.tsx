interface TableHeaderProps {
  id?: string;
  children: React.ReactNode;
  filter?: boolean;
  order?: string;
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}

function TableHeader({
  id,
  children,
  filter,
  onClick,
  order,
}: TableHeaderProps) {
  return (
    <th
      id={id}
      onClick={onClick}
      className="text-white p-2 font-bold border-b text-left whitespace-nowrap"
    >
      {filter && (
        <span className="material-symbols-outlined text-sm mr-2">
          {order === "asc" ? "south" : "north"}
        </span>
      )}
      {children}
    </th>
  );
}

export default TableHeader;
