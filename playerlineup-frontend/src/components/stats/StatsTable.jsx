import Stat from './Stat';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

function StatsTable({ stats, onDelete, playerId, user, playerUserId }) {
  const { theme/*, ...*/ } = useContext(ThemeContext);

  if (stats.length === 0) {
    return (
      <div className='alert alert-info'>This player has no stats yet.</div>
    );
  }

  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`}>
        <thead>
          <tr>
            <th>Stat ID</th>
            <th>Points</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Steals</th>
            <th>Turnovers</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <Stat key={stat.id} {...stat} playerId={playerId} onDelete={onDelete}
              user={user} playerUserId={playerUserId}/>
          ))}
          <tr>
            <td>Averages</td>
            <td>
              {(stats.reduce((total, stat) => total + stat.points, 0) / stats.length).toFixed(1)}
            </td>
            <td>
              {(stats.reduce((total, stat) => total + stat.rebounds, 0) / stats.length).toFixed(1)}
            </td>
            <td>
              {(stats.reduce((total, stat) => total + stat.assists, 0) / stats.length).toFixed(1)}
            </td>
            <td>
              {(stats.reduce((total, stat) => total + stat.steals, 0) / stats.length).toFixed(1)}
            </td>
            <td>
              {(stats.reduce((total, stat) => total + stat.turnovers, 0) / stats.length).toFixed(1)}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;