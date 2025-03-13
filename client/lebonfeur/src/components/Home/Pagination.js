import React from 'react'
import "./pagination.css"

function Pagination({ totalPosts, postsPerPage, setCurrentPage, currentPage}) {
  let pages = [];

  for(let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++){
    pages.push(i);
  }

  return (
    <div className='pagination'>
      {
        pages.map((page, index) => {
          return <button className={page === currentPage ? 'pagination-active' : 'pagination-button'} key={index} onClick={() => setCurrentPage(page)} >{page}</button>
        })
      }
    </div>
  )
}

export default Pagination
