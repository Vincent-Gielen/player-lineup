import { useParams, Link } from 'react-router-dom';
import { IoPencilOutline } from 'react-icons/io5';
import useSWR from 'swr';
import { getById } from '../../api/index.js';

const PlayerDetail = () => {
  const { userId } = useParams();
  const idAsNumber = Number(userId);

  const { data: user, error } = useSWR(`users/${idAsNumber}`, getById);

  if (error) {    
    return <div>Failed to load information on user</div>;
  }

  if (!user) {
    return( 
      <div>
        <h1>User was not found</h1>
        <p>User with ID {userId} was not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>User Details</h1>
      <h2>{user.name}
        <Link to={`/users/edit/${userId}`} className='btn btn-light'>
          <IoPencilOutline />
        </Link>
      </h2>
      
      <h3 className='userInfo'>ID: {user.id}</h3>
      <h3 className='userInfo'>Name: {user.name}</h3>
      <h3 className='userInfo'>Email: {user.email}</h3>
      
    </div>
  );
};

export default PlayerDetail;
