interface PagingationProps {
  currentPage: number;
  totalPages: number;
  onPageNext: () => void;
  onPagePrev: () => void;
}

function Pagingation({
  currentPage,
  totalPages,
  onPageNext,
  onPagePrev,
}: PagingationProps) {
  return (
    <div className="flex items-center justify-between mt-4 border rounded-xl">
      <button
        onClick={onPagePrev}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-white disabled:opacity-50"
      >
        <span className="material-symbols-outlined me-1">navigate_before</span>
        Sebelumnya
      </button>

      <div className="text-white">
        <i>
          Hal. {currentPage} / {totalPages}
        </i>
      </div>

      <button
        onClick={onPageNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-white disabled:opacity-50"
      >
        Selanjutnya
        <span className="material-symbols-outlined ms-1">navigate_next</span>
      </button>
    </div>
  );
}

export default Pagingation;
