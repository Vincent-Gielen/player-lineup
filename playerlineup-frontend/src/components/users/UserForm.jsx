import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import LabelInput from '../LabelInput';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const schema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().label('Name'),
  email: Joi.string().email({ tlds: {allow: tlds}}).required().label('Email'),
});

export default function UserForm({ user, saveUser }) {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
    resolver: joiResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveUser({
      id: user?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>

        <LabelInput
          label='Name'
          name='name'
          type='text'
        />

        <LabelInput
          label='Email'
          name='email'
          type='email'
        />

        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button type='submit' disabled={isSubmitting} className='btn btn-primary'>
              Update User
            </button>
            <Link
              disabled={isSubmitting}
              className='btn btn-light'
              to='/'
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
