import { useCallback, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getById, deleteById } from '../../api/index.js';
import StatsTable from '../../components/stats/StatsTable.jsx';
import AsyncData from '../../components/AsyncData.jsx';
import { useAuth } from '../../contexts/auth';

const PlayerDetail = () => {
  const { playerId } = useParams();
  const idAsNumber = Number(playerId);
  const { user } = useAuth();

  const { data: player, isLoading, error } = useSWR(`players/${idAsNumber}`, getById);
  const [stats, setStats] = useState(player?.stats || []);

  const { trigger: deleteStat, error: deleteError } = useSWRMutation(
    `players/${idAsNumber}/stats`,
    deleteById,
  ); 

  useEffect(() => {
    if (player?.stats) {
      setStats(player.stats);
    }
  }, [player]);

  const handleDeleteStat = useCallback(
    async (id) => {
      await deleteStat(id);
      alert('Stat deleted successfully');
      setStats((prevStats) => prevStats.filter((s) => s.id !== id));
    },
    [deleteStat],
  );

  if (error) {
    return <div>Failed to load information on player</div>;
  }

  if (!player) {
    return( 
      <div>
        <h1>Player was not found</h1>
        <p>Player with ID {playerId} was not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Player Details</h1>
      
      <h2>{player.name} - {player.position}</h2>
        
      {player.user_id === user?.id && (
        <Link to='stats/add' className='btn btn-primary btn-add'>
          Add Stat
        </Link>
      )}
      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <StatsTable 
            stats={stats} 
            onDelete={handleDeleteStat}
            playerId={idAsNumber}
            user={user}
            playerUserId={player.user_id}
          />
        </AsyncData>
      </div>
    </div>
  );
};

export default PlayerDetail;
