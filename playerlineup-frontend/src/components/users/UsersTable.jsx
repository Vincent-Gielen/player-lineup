import { useState, useContext } from 'react';
import User from './User';
import { ThemeContext } from '../../contexts/Theme.context';
import ReactPaginate from 'react-paginate';

function UsersTable({ users, onDelete }) {
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * usersPerPage;
  const currentUsers = users.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(users.length / usersPerPage);

  if (users.length === 0) {
    return (
      <div className='alert alert-info'>There are no users yet.</div>
    );
  }

  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`}>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Name</th>
            <th style={{ width: '50%' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <User key={user.id} {...user} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
      <ReactPaginate
        className='pagination'
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default UsersTable;