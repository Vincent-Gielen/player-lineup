import useSWR from 'swr';
import { getById } from '../../api/index.js';
import { memo } from 'react';

const PlayerCompareMemoized = memo(function PlayerCompare({ id }) {
  const playerId = Number(id);

  const { data: player, error } = useSWR(`players/${playerId}`, getById);

  if (error) {
    return <tr><td colSpan="7">Failed to load player data</td></tr>;
  }

  if (!player) {
    return <tr><td colSpan="7">Loading...</td></tr>;
  }

  const stats = Array.isArray(player?.stats) ? player.stats : [];

  const calculateAverage = (statKey) => {
    if (stats.length === 0) return 0; 
    return (stats.reduce((total, stat) => total + stat[statKey], 0) / stats.length).toFixed(1);
  };

  return (
    <tr>
      <td>{player.name}</td>
      <td>{player.position}</td>
      <td>{calculateAverage('points')}</td>
      <td>{calculateAverage('rebounds')}</td>
      <td>{calculateAverage('assists')}</td>
      <td>{calculateAverage('steals')}</td>
      <td>{calculateAverage('turnovers')}</td>
    </tr>
  );
});

export default PlayerCompareMemoized;
