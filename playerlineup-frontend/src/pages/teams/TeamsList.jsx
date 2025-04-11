import { useState, useMemo, useCallback } from 'react';
import TeamsTable from '../../components/teams/TeamsTable.jsx';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api/index.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

const TeamsList = () => {
  const [text, setText] = useState('');
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterMyTeams, setFilterMyTeams] = useState('');
  const { data: teams = [], isLoading, error } = useSWR('teams', getAll);

  const { trigger: deleteTeam, error: deleteError } = useSWRMutation(
    'teams',
    deleteById,
  );

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterMyTeams
        ? team.user_id === user?.id
        : true;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterMyTeams, teams, user?.id]);

  const handleDeleteTeam = useCallback(
    async (id) => {
      await deleteTeam(id);
      alert('Team deleted successfully');
    },
    [deleteTeam],
  );

  return (
    <>
      <h1>My Teams</h1>
      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          className='form-control rounded'
          placeholder='Search by Team Name'
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-cy='teams_search_input'
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
          data-cy='teams_search_btn'
        >
          Search
        </button>
      </div>
      <div className='mb-3'>
        <label className='form-check-label me-2'>Show Only My Teams</label>
        <input
          type='checkbox'
          className='form-check-input'
          checked={filterMyTeams}
          onChange={() => setFilterMyTeams((prev) => !prev)}
        />
      </div>
      <Link to='/teams/add' className='btn btn-primary btn-add'>
        Add Team
      </Link>

      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <TeamsTable teams={filteredTeams} onDelete={handleDeleteTeam} />
        </AsyncData>
      </div>
    </>
  );
};

export default TeamsList;
