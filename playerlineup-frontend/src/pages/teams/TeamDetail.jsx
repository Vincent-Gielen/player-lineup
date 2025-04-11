import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getById, deleteById } from '../../api/index.js';
import AsyncData from '../../components/AsyncData.jsx';
import TeamDetailsTable from '../../components/teams/TeamDetailsTable.jsx';
import { useCallback, useState, useEffect } from 'react';

const TeamDetail = () => {
  const { teamId } = useParams();
  const idAsNumber = Number(teamId);

  const { data: team, isLoading, error } = useSWR(`teams/${idAsNumber}`, getById);
  const [players, setPlayers] = useState(team?.players || []);

  const { trigger: removePlayer, error: deleteError } = useSWRMutation(
    `teams/${idAsNumber}/players`,
    deleteById,
  );

  useEffect(() => {
    if (team) {
      setPlayers(team.players || []);
    }
  }, [team]);

  const handleRemovePlayer = useCallback(
    async (id) => {
      await removePlayer(id);
      alert('Player removed successfully');
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== id));
    },
    [removePlayer],
  );

  if (error) {
    return <div>Failed to load information on team</div>;
  }

  if (!team) {
    return( 
      <div>
        <h1>Team was not found</h1>
        <p>Team with ID {teamId} was not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Team Details</h1>
      <h2>{team.name}</h2>
      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <TeamDetailsTable
            players={players} 
            onDelete={handleRemovePlayer}
            teamId={idAsNumber}
          />
        </AsyncData>
      </div>
    </div>
  );
};

export default TeamDetail;
