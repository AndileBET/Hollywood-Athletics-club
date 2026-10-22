export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pages = totalPages <= 4
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : [1, 2, 3, totalPages];

  const goToPage = (page) => {
    onChange(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <nav className="list-pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goToPage(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
      >
        Previous
      </button>

      <div className="list-pagination-pages">
        {pages.map((page, index) => (
          <span key={`page-${page}`}>
            {index === 3 && totalPages > 4 ? <span className="list-pagination-ellipsis">...</span> : null}
          <button
            type="button"
            key={page}
            className={page === safeCurrentPage ? 'is-active' : ''}
            onClick={() => goToPage(page)}
            aria-current={page === safeCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goToPage(safeCurrentPage + 1)}
        disabled={safeCurrentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
