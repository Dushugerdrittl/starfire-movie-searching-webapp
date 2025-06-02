import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page or no pages
    }

    const pageNeighbours = 1; // How many pages to show on each side of the current page

    const fetchPageNumbers = () => {
        const totalNumbers = (pageNeighbours * 2) + 3; // pageNeighbours on each side + current + first + last
        const totalBlocks = totalNumbers + 2; // Add 2 for potential ellipses

        if (totalPages > totalBlocks) {
            const pages = [];
            const leftBound = currentPage - pageNeighbours;
            const rightBound = currentPage + pageNeighbours;

            const startPage = Math.max(2, leftBound);
            const endPage = Math.min(totalPages - 1, rightBound);

            pages.push(1); // Always show the first page

            if (startPage > 2) {
                pages.push('...'); // Ellipsis if there's a gap after the first page
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...'); // Ellipsis if there's a gap before the last page
            }

            pages.push(totalPages); // Always show the last page
            return pages;
        }

        // If not enough pages to need ellipses, show all pages
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = fetchPageNumbers();

    return (
        <div className="pagination-controls">
            <button
                className="pagination-button"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                &laquo; First
            </button>
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &larr; Previous
            </button>

            {pageNumbers.map((page, index) => {
                if (page === '...') {
                    return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
                }
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        disabled={currentPage === page}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next &rarr;
            </button>
            <button
                className="pagination-button"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                Last &raquo;
            </button>
        </div>
    );
};

export default Pagination;
