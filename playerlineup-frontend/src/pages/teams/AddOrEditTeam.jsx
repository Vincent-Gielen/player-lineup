import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';
import { save, getById } from '../../api';
import AsyncData from '../../components/AsyncData';
import TeamForm from '../../components/teams/TeamForm';

export default function AddOrEditTeam() {
  const { teamId } = useParams();

  const {
    data: team,
    error: teamError,
    isLoading: teamLoading,
  } = useSWR(teamId ? `teams/${teamId}` : null, getById);

  const { trigger: saveTeam, error: saveError } = useSWRMutation(
    'teams',
    save,
  ); 

  return (
    <>
      <h1>{teamId ? 'Edit' : 'Add'}</h1>

      {/* 👇 5 */}
      <AsyncData
        error={teamError || saveError}
        loading={teamLoading}
      >
        {/* 👇 4 */}
        <TeamForm
          team={team}
          saveTeam={saveTeam}
        />
      </AsyncData>
    </>
  );
}