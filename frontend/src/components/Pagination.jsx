export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="list-pagination" aria-label="Pagination">
      <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</button>
      <div className="list-pagination-pages">
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            className={page === currentPage ? 'is-active' : ''}
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</button>
    </nav>
  );
}
