import React, { useEffect } from 'react';

const Pagination = ({ jobsPerPage, jobCount, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(jobCount / jobsPerPage); i++) {
        pageNumbers.push(i);
    }
    const totalPages = Math.max(...pageNumbers);
    console.log('first' + totalPages)
    useEffect(() => {

    }, [currentPage]);
    return (
        <nav>
            <ul className='pagination'>
                {currentPage === 1 ?
                    <li class="page-item disabled">
                        <span class="page-link" tabindex="-1">Previous</span>
                    </li> :
                    <li class="page-item">
                        <span class="page-link" onClick={() => paginate(currentPage - 1)}>Previous</span>
                    </li>
                }
                {pageNumbers.map(number => (
                    <li key={number} className={currentPage ===number ? `page-item disabled`: `page-item`}>
                        <span onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </span>
                    </li>
                ))}
                {totalPages === currentPage ?
                    <li class="page-item disabled">
                        <span class="page-link">Next</span>
                    </li> :
                    <li class="page-item">
                        <span class="page-link" onClick={() => paginate(currentPage + 1)}>Next</span>
                    </li>
                }
            </ul>
        </nav>
    );
};

export default Pagination;