import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api/index.js';
import PlayersTable from '../../components/players/PlayersTable';
import AsyncData from '../../components/AsyncData';
import { useAuth } from '../../contexts/auth';

const PlayersList = () => {
  const [text, setText] = useState('');
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterMyPlayers, setFilterMyPlayers] = useState('');
  const { data: players = [], isLoading, error } = useSWR('players', getAll);

  const { trigger: deletePlayer, error: deleteError } = useSWRMutation(
    'players',
    deleteById,
  );

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterMyPlayers
        ? player.user_id === user?.id
        : true;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterMyPlayers, players, user?.id]);

  const handleDeletePlayer = useCallback(
    async (id) => {
      await deletePlayer(id);
      alert('Player deleted successfully');
    },
    [deletePlayer],
  );

  return (
    <>
      <h1>All Players</h1>
      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          className='form-control rounded'
          placeholder='Search by Name'
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-cy='players_search_input'
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
          data-cy='players_search_btn'
        >
          Search
        </button>
      </div>
      <div className='mb-3'>
        <label className='form-check-label me-2'>Show Only My Players</label>
        <input
          type='checkbox'
          className='form-check-input'
          checked={filterMyPlayers}
          onChange={() => setFilterMyPlayers((prev) => !prev)}
        />
      </div>
      <Link to='/players/add' className='btn btn-primary btn-add'>
        Add Player
      </Link>

      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <PlayersTable players={filteredPlayers} onDelete={handleDeletePlayer} CurrentUserId={user?.id}/>
        </AsyncData>
      </div>
    </>
  );
};

export default PlayersList;
