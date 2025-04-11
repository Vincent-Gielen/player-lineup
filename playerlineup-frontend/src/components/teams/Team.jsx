// Team.jsx
import { IoTrashOutline, IoPencilOutline, IoChevronForwardOutline   } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

const TeamMemoized = memo(function Team({ id, name, players = [], onDelete }) {
  const { theme } = useContext(ThemeContext);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      onDelete(id);
    }
  };

  return (
    <>
      <table className={`table table-hover table-responsive table-${theme}`} data-cy='team'>
        <thead>
          <tr>
            <th colSpan={3}>
              <Link to={`/teams/${id}`} className='btn btn-primary btn-team' data-cy='team_name'>
                {name}<IoChevronForwardOutline /></Link>
              <button className='btn btn-primary btn-team' onClick={handleDelete} data-cy='team_remove_btn'> 
                <IoTrashOutline />
              </button>
              <Link to={`/teams/edit/${id}`} className='btn btn-light' data-cy='team_edit_btn'>
                <IoPencilOutline />
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {players.length > 0 ? (
            players.map((player) => (
              <tr key={player.id}>
                <td style={{ width: '50%' }}>
                  <Link to={`/players/${player.id}`} className='btn btn-primary'>{player.name}</Link>
                </td>
                <td style={{ width: '50%' }}>{player.position}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No players in this team</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
});

export default TeamMemoized;
