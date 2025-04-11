import { useContext, useState } from 'react';
import { ThemeContext } from './contexts/Theme.context';
import useSWR from 'swr';
import { getAll } from './api/index.js';
import ComparePlayerTable from './components/compare/ComparePlayerTable.jsx';
import AsyncData from './components/AsyncData.jsx';

function App() {
  const theme = useContext(ThemeContext);
  const { data: players = [], isLoading, error } = useSWR('players', getAll);
  const [selectedPlayers, setSelectedPlayers] = useState({ player1: null, player2: null });

  if (isLoading) return <div>Loading players...</div>;
  if (error) return <div>Failed to load players</div>;

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    if (!value) {
      setSelectedPlayers((prev) => ({ ...prev, [name]: null }));
      return;
    }

    const selectedPlayer = players.find((player) => Number(player.id) === Number(value));
    if (selectedPlayer) {
      setSelectedPlayers((prev) => ({ ...prev, [name]: selectedPlayer }));
    }    
  };

  const selectedPlayersArray = Object.values(selectedPlayers).filter(Boolean);
  
  return (
    <>
      <h1>Player Lineup</h1>

      <div className={`comparison-dropdowns table-${theme}`}>
        <div className={'select-player'}>
          <label htmlFor="player1">Select Player 1:</label>
          <select name="player1" id="player1" onChange={handleSelectChange} data-cy='select_player1'>
            <option value="">-- Select Player --</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} - {player.position}
              </option>
            ))}
          </select>
        </div>

        <div className={'select-player'}>          
          <label htmlFor="player2">Select Player 2:</label>
          <select name="player2" id="player2" onChange={handleSelectChange} data-cy='select_player2'>
            <option value="">-- Select Player --</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} - {player.position}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error}>
          <ComparePlayerTable 
            players={selectedPlayersArray} 
          />
        </AsyncData>
      </div>
    </>
  );
}

export default App;
