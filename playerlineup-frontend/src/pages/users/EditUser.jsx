import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';
import { save, getById } from '../../api';
import UserForm from '../../components/users/UserForm';
import AsyncData from '../../components/AsyncData';

export default function AddOrEditPlayer() {
  const { userId } = useParams();

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR(userId ? `users/${userId}` : null, getById);

  const { trigger: saveUser, error: saveError } = useSWRMutation(
    'users',
    save,
  ); 

  return (
    <>
      <h1>{userId ? 'Edit' : 'No bueno'}</h1>

      {/* 👇 5 */}
      <AsyncData
        error={userError || saveError}
        loading={userLoading}
      >
        {/* 👇 4 */}
        <UserForm
          user={user}
          saveUser={saveUser}
        />
      </AsyncData>
    </>
  );
}