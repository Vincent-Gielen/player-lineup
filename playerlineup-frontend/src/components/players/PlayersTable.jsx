import { useState, useContext } from 'react';
import Player from './Player';
import { ThemeContext } from '../../contexts/Theme.context';
import ReactPaginate from 'react-paginate';

function PlayersTable({ players, onDelete, CurrentUserId }) {
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(0);
  const playersPerPage = 5;

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * playersPerPage;
  const currentPlayers = players.slice(offset, offset + playersPerPage);
  const pageCount = Math.ceil(players.length / playersPerPage);

  if (players.length === 0) {
    return (
      <div className='alert alert-info' data-cy='no_players_message'>There are no players yet.</div>
    );
  }

  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`}>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Name</th>
            <th style={{ width: '35%' }}>Position</th>
            <th style={{ width: '5%' }}>Delete</th>
            <th style={{ width: '5%' }}>Edit</th>
            <th style={{ width: '5%' }}>User</th>
          </tr>
        </thead>
        <tbody>
          {currentPlayers.map((player) => (
            <Player key={player.id} {...player} onDelete={onDelete} CurrentUserId={CurrentUserId}/>
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

export default PlayersTable;