import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import LabelInput from '../LabelInput';
import SelectList from '../SelectList';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().label('Name'),
  position: Joi.string().required().label('Position'),
});

const EMPTY_PLAYER = {
  id: undefined,
  name: '',
  position: '',
};

export default function PlayerForm({ player = EMPTY_PLAYER, savePlayer }) {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: player?.name,
      position: player?.position,
    },
    resolver: joiResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;
    await savePlayer({
      id: player?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/players'),
    });
  };

  const playerPositions = [
    { value: 'Point Guard', label: 'Point Guard' },
    { value: 'Shooting Guard', label: 'Shooting Guard' },
    { value: 'Small Forward', label: 'Small Forward' },
    { value: 'Power Forward', label: 'Power Forward' },
    { value: 'Center', label: 'Center' },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>

        <LabelInput
          label='Name'
          name='name'
          type='text'
          data-cy='name_input'
        />

        <SelectList
          label='Position'
          name='position'
          placeholder='Select a position'
          items={playerPositions}
          type='text'
          data-cy='position_input'
        />

        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button type='submit' disabled={isSubmitting} className='btn btn-primary' data-cy='submit_player'>
              {player?.id
                ? 'Update Player'
                : 'Add Player'}
            </button>
            <Link
              disabled={isSubmitting}
              className='btn btn-light'
              to='/players'
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
