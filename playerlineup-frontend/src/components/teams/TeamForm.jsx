import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import LabelInput from '../LabelInput';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().label('Name'),
});

const EMPTY_TEAM = {
  id: undefined,
  name: '',
};

// const validationRules = {
//   name: {
//     required: 'Name is required',
//   },
// };

export default function Teamform({ team = EMPTY_TEAM, saveTeam }) {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: team?.name,
    },
    resolver: joiResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveTeam({
      id: team?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/teams'),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>

        <LabelInput
          label='Name'
          name='name'
          type='text'
          data-cy='name_input'
        />

        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button type='submit' disabled={isSubmitting} className='btn btn-primary' data-cy='submit_team'>
              {team?.id
                ? 'Update Team'
                : 'Add Team'}
            </button>
            <Link
              disabled={isSubmitting}
              className='btn btn-light'
              to='/teams'
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
