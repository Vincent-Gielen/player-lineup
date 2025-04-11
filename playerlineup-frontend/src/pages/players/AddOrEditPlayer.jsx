import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';
import { save, getById } from '../../api';
import PlayerForm from '../../components/players/PlayerForm';
import AsyncData from '../../components/AsyncData';

export default function AddOrEditPlayer() {
  const { playerId } = useParams();

  const {
    data: player,
    error: playerError,
    isLoading: playerLoading,
  } = useSWR(playerId ? `players/${playerId}` : null, getById);

  const { trigger: savePlayer, error: saveError } = useSWRMutation(
    'players',
    save,
  ); 

  return (
    <>
      <h1>{playerId ? 'Edit' : 'Add'}</h1>

      {/* 👇 5 */}
      <AsyncData
        error={playerError || saveError}
        loading={playerLoading}
      >
        {/* 👇 4 */}
        <PlayerForm
          player={player}
          savePlayer={savePlayer}
        />
      </AsyncData>
    </>
  );
}