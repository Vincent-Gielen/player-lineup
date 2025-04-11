import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import LabelInput from '../LabelInput';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const schema = Joi.object({
  points: Joi.number().min(0).max(100).required().label('Points'),
  rebounds: Joi.number().min(0).max(100).required().label('Rebounds'),
  assists: Joi.number().min(0).max(100).required().label('Assists'),
  steals: Joi.number().min(0).max(100).required().label('Steals'),
  turnovers: Joi.number().min(0).max(100).required().label('Turnovers'),
});

const EMPTY_STAT = {
  id: undefined,
  points: 0,
  rebounds: 0,
  assists: 0,
  steals: 0,
  turnovers: 0,
};

export default function StatForm({ stat = EMPTY_STAT, saveStat, playerId }) {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      points: stat?.points ?? 0,
      rebounds: stat?.rebounds ?? 0,
      assists: stat?.assists ?? 0,
      steals: stat?.steals ?? 0,
      turnovers: stat?.turnovers ?? 0,
    },
    resolver: joiResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveStat({
      id: stat?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate(`/players/${playerId}`),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='form-stat'>

        <LabelInput
          label='Points'
          name='points'
          type='number'
        />
        <LabelInput
          label='Rebounds'
          name='rebounds'
          type='number'
        />
        <LabelInput
          label='Assists'
          name='assists'
          type='number'
        />
        <LabelInput
          label='Steals'
          name='steals'
          type='number'
        />
        <LabelInput
          label='Turnovers'
          name='turnovers'
          type='number'
        />

        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button type='submit' disabled={isSubmitting} className='btn btn-primary'>
              {stat?.id
                ? 'Update Stat'
                : 'Add Stat'}
            </button>
            <Link
              disabled={isSubmitting}
              className='btn btn-light'
              to={`/players/${playerId}`}
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
