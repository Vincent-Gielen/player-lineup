import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import PlayerCompare from './PlayerCompare';

function ComparePlayerTable({ players }) {
  const { theme/*, ...*/ } = useContext(ThemeContext);

  if (!Array.isArray(players) || players.length !== 2 || players.some((player) => player === null)) {
    return <div className='alert alert-info' data-cy='two_players_message'>Please choose 2 players</div>;
  }  
  
  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`} data-cy='stats_table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Points</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Steals</th>
            <th>Turnovers</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayerCompare key={player.id} {...player} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparePlayerTable;