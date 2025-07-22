function TableHeadRow({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 bg-[#343a40]">
      <tr>{children}</tr>
    </thead>
  );
}

export default TableHeadRow;
