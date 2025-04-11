import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import { IoTrashOutline, IoAddOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

function TeamDetailsTable({ players, onDelete }) {
  const { theme } = useContext(ThemeContext);

  if (players.length === 0) {
    return (
      <div>
        <div className='alert alert-info'>This team has no players yet.</div>
        <Link to='players/add' className='btn btn-primary btn-add'>
          Add player<IoAddOutline />
        </Link>
      </div>
    );
  }

  const abbreviatePosition = (position) => {
    switch (position) {
      case 'Point Guard':
        return 'PG';
      case 'Shooting Guard':
        return 'SG';
      case 'Small Forward':
        return 'SF';
      case 'Power Forward':
        return 'PF';
      case 'Center':
        return 'C';
      default:
        return position;
    }
  };

  const calculateAveragePlayerStats = (stats) => {
    const totalGames = stats?.length;
    if (totalGames === 0) return { points: 0, rebounds: 0, assists: 0, steals: 0, turnovers: 0 };

    const totals = stats.reduce(
      (acc, game) => {
        acc.points += game.points;
        acc.rebounds += game.rebounds;
        acc.assists += game.assists;
        acc.steals += game.steals;
        acc.turnovers += game.turnovers;
        return acc;
      },
      { points: 0, rebounds: 0, assists: 0, steals: 0, turnovers: 0 },
    );

    return {
      points: (totals.points / totalGames).toFixed(1),
      rebounds: (totals.rebounds / totalGames).toFixed(1),
      assists: (totals.assists / totalGames).toFixed(1),
      steals: (totals.steals / totalGames).toFixed(1),
      turnovers: (totals.turnovers / totalGames).toFixed(1),
    };
  };

  const calculateTotalTeamStats = (players) => {
    const totalPlayers = players.length;
    if (totalPlayers === 0) return { points: 0, rebounds: 0, assists: 0, steals: 0, turnovers: 0 };

    const totals = players.reduce(
      (acc, player) => {
        const averageStats = calculateAveragePlayerStats(player.stats);
        acc.points += parseFloat(averageStats.points);
        acc.rebounds += parseFloat(averageStats.rebounds);
        acc.assists += parseFloat(averageStats.assists);
        acc.steals += parseFloat(averageStats.steals);
        acc.turnovers += parseFloat(averageStats.turnovers);
        return acc;
      },
      { points: 0, rebounds: 0, assists: 0, steals: 0, turnovers: 0 },
    );

    return {
      points: totals.points.toFixed(1),
      rebounds: totals.rebounds.toFixed(1),
      assists: totals.assists.toFixed(1),
      steals: totals.steals.toFixed(1),
      turnovers: totals.turnovers.toFixed(1),
    };
  };

  const teamTotalStats = calculateTotalTeamStats(players);

  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`}>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Name</th>
            <th style={{ width: '5%' }}>Position</th>
            <th>Points</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Steals</th>
            <th>Turnovers</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => {
            const player = players[index];
            if (player) {
              const averageStats = calculateAveragePlayerStats(player.stats);
              return (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{abbreviatePosition(player.position)}</td>
                  <td>{averageStats.points}</td>
                  <td>{averageStats.rebounds}</td>
                  <td>{averageStats.assists}</td>
                  <td>{averageStats.steals}</td>
                  <td>{averageStats.turnovers}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => onDelete(player.id)}
                    >
                      <IoTrashOutline />
                    </button>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={index}>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    Add a player 
                    <Link to='players/add' className='btn btn-primary btn-add'>
                      <IoAddOutline />
                    </Link>
                  </td>
                </tr>
              );
            }
          })}
          {/* Averages Row */}
          <tr>
            <td>Averages</td>
            <td>Team</td>
            <td>{teamTotalStats.points}</td>
            <td>{teamTotalStats.rebounds}</td>
            <td>{teamTotalStats.assists}</td>
            <td>{teamTotalStats.steals}</td>
            <td>{teamTotalStats.turnovers}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TeamDetailsTable;
