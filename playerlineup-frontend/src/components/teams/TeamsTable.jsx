import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Team from './Team';

function TeamsTable({ teams, onDelete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const teamsPerPage = 1;
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * teamsPerPage;
  const currentTeams = teams.slice(offset, offset + teamsPerPage);
  const pageCount = Math.ceil(teams.length / teamsPerPage);

  if (teams.length === 0) {
    return <div className='alert alert-info' data-cy='no_teams_message'>There are no teams yet.</div>;
  }

  return (
    <div>
      {currentTeams.map((team) => (
        <Team
          key={team.id}
          id={team.id}
          name={team.name}
          players={team.players}
          onDelete={onDelete}
        />
      ))}
      <ReactPaginate
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

export default TeamsTable;
