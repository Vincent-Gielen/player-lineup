import { useState, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api/index.js';
import UsersTable from '../../components/users/UsersTable';
import AsyncData from '../../components/AsyncData';

const UsersList = () => {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const {
    data: users = [],
    isLoading,
    error,
  } = useSWR('users', getAll);

  const { trigger: deleteUser, error: deleteError } = useSWRMutation(
    'users',
    deleteById,
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        return (
          u.name.toLowerCase().includes(search.toLowerCase())
        );
      }),
    [search, users],
  );

  const handleDeleteUser = useCallback(
    async (id) => {
      await deleteUser(id);
      alert('User deleted successfully');
    },
    [deleteUser],
  );

  return (
    <>
      <h1>All Users</h1>
      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          className='form-control rounded'
          placeholder='Search by Name'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
        >
          Search
        </button>
      </div>

      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <UsersTable 
            users={filteredUsers} 
            onDelete={handleDeleteUser}
          />
        </AsyncData>
      </div>
    </>    
  );
};

export default UsersList;