import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getAll } from '../../api/index.js';
import SelectList from '../SelectList';

export default function AddPlayerToTeamForm({ team, addPlayer }) {
  const navigate = useNavigate();

  const validationRules = {
    playerId: {
      required: 'Player is required',
    },
  };

  const {
    data: players = [],
    isLoading,
    error,
  } = useSWR('players', getAll);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      playerId: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async ({ player_id }) => {
    if (!isValid) return;    
    await addPlayer({
      player_id,
    }, {
      throwOnError: false,
      onSuccess: () => navigate(`/teams/${team.id}`),
    });
  };

  if (isLoading) return <div>Loading players...</div>;
  if (error) return <div>Failed to load players</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="mb-3">
          <label htmlFor="playerId" className="form-label">
            Choose a player to add to the team:
          </label>
          <SelectList
            label="Player"
            name="player_id"//heeft het probleem opgelost
            placeholder="Select a player"
            validationRules={validationRules.playerId}
            items={players.map((player) => ({
              label: `${player.name} - ${player.position}`,
              value: player.id,
            }))}
            type="number"
            data-cy="player_input"
          />
        </div>

        <div className="clearfix">
          <div className="btn-group float-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              Add Player
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="btn btn-light"
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
