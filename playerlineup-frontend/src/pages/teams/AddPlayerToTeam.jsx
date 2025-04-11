import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';
import { getById, put } from '../../api';
import AsyncData from '../../components/AsyncData';
import AddPlayerToTeamForm from '../../components/teams/AddPlayerToTeamForm';

export default function AddPlayerToTeam() {
  const { teamId } = useParams();

  const {
    data: team,
    error: teamError,
    isLoading: teamLoading,
  } = useSWR(teamId ? `teams/${teamId}` : null, getById);

  const { trigger: addPlayer, error: saveError } = useSWRMutation(
    `teams/${teamId}/players`,
    put,
  ); 

  return (
    <>
      <h1>Add Player to {team?.name}</h1>

      {/* 👇 5 */}
      <AsyncData
        error={teamError || saveError}
        loading={teamLoading}
      >
        {/* 👇 4 */}
        <AddPlayerToTeamForm
          team={team}
          addPlayer={addPlayer}
        />
      </AsyncData>
    </>
  );
}