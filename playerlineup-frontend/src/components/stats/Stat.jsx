import { IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const StatMemoized = memo(function Stat({ id, points,
  rebounds, assists, steals, turnovers, onDelete, playerId, user, playerUserId }) {

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      onDelete(id);
    }
  };
  
  return (
    <tr>
      <td>{id}</td>
      <td>{points}</td>
      <td>{rebounds}</td>
      <td>{assists}</td>
      <td>{steals}</td>
      <td>{turnovers}</td>
      {user.id === playerUserId ? (
        <>
          <td>
            <button className='btn btn-primary' onClick={handleDelete}>
              <IoTrashOutline />
            </button>
          </td>
          <td>
            <Link to={`/players/${playerId}/stats/edit/${id}`} className='btn btn-light'>
              <IoPencilOutline />
            </Link>
          </td>
        </>
      ) : (
        <>
          <td></td>
          <td></td>
        </>
      )}
    </tr>
  );
});

export default StatMemoized;