export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const PAGE_WINDOW_SIZE = 15;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const chunkStart = Math.floor((safeCurrentPage - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1;
  const chunkEnd = Math.min(chunkStart + PAGE_WINDOW_SIZE - 1, totalPages);
  const pages = Array.from(
    { length: chunkEnd - chunkStart + 1 },
    (_, index) => chunkStart + index
  );

  const hasPreviousChunk = chunkStart > 1;
  const hasNextChunk = chunkEnd < totalPages;

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
        {hasPreviousChunk ? (
          <button
            type="button"
            className="list-pagination-ellipsis"
            onClick={() => goToPage(chunkStart - 1)}
            aria-label={`Previous pages before ${chunkStart}`}
            title={`Go to page ${chunkStart - 1}`}
          >
            ...
          </button>
        ) : null}

        {pages.map((page) => (
          <button
            type="button"
            key={page}
            className={page === safeCurrentPage ? 'is-active' : ''}
            onClick={() => goToPage(page)}
            aria-current={page === safeCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {hasNextChunk ? (
          <button
            type="button"
            className="list-pagination-ellipsis"
            onClick={() => goToPage(chunkEnd + 1)}
            aria-label={`Next pages after ${chunkEnd}`}
            title={`Go to page ${chunkEnd + 1}`}
          >
            ...
          </button>
        ) : null}
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
