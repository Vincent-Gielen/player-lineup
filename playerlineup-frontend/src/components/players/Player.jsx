import { IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const PlayerMemoized = memo(function Player({ id, name, position, user_id, onDelete, CurrentUserId }) {

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      onDelete(id);
    }
  };
  
  return (
    <tr data-cy='player'>
      <td data-cy='player_name'>
        <Link to={`/players/${id}`} className='btn btn-primary'>{name}</Link>
      </td>
      <td data-cy='player_position'>{position}</td>
      {user_id === CurrentUserId ? (
        <>
          <td>
            <button className='btn btn-primary' onClick={handleDelete} data-cy='player_remove_btn'>
              <IoTrashOutline />
            </button>
          </td>
          <td>
            <Link to={`/players/edit/${id}`} className='btn btn-light' data-cy='player_edit_btn'>
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
      <td>{user_id}</td>
    </tr>
  );
});

export default PlayerMemoized;
