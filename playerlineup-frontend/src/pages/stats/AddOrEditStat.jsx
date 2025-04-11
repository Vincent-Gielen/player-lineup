import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';
import { save, getById } from '../../api';
import StatForm from '../../components/stats/StatForm';
import AsyncData from '../../components/AsyncData';

export default function AddOrEditStat() {
  const { playerId, statId } = useParams();
  
  const {
    data: stat,
    error: statError,
    isLoading: statLoading,
  } = useSWR(statId ? `players/${playerId}/stats/${statId}` : null, getById);

  const { trigger: saveStat, error: saveError } = useSWRMutation(
    `players/${playerId}/stats`,
    save,
  ); 

  return (
    <>
      <h1>{statId ? 'Edit' : 'Add'}</h1>

      {/* 👇 5 */}
      <AsyncData
        error={statError || saveError}
        loading={statLoading}
      >
        {/* 👇 4 */}
        <StatForm
          stat={stat}
          saveStat={saveStat}
          playerId={playerId}
        />
      </AsyncData>
    </>
  );
}