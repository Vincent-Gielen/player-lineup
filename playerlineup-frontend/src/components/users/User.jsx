import { IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const PlayerMemoized = memo(function Player({ id, name, email, onDelete }) {
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(id);
    }
  };
  
  return (
    <tr>
      <td>
        <Link to={`/users/${id}`} className='btn btn-primary'>{name}</Link>
      </td>
      <td>{email}</td>
      <td>
        <button className='btn btn-primary' onClick={handleDelete}>
          <IoTrashOutline />
        </button>
      </td>
      <td>
        <Link to={`/users/edit/${id}`} className='btn btn-light'>
          <IoPencilOutline />
        </Link>
      </td>
    </tr>
  );
});

export default PlayerMemoized;