// src/pages/Login.jsx
import { useCallback } from 'react'; // 👈 1
import { useNavigate, useLocation } from 'react-router-dom'; // 👈 3
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth'; // 👈 2
import Error from '../components/Error'; // 👈 5
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: tlds } }).required().label('Email'),
  password: Joi.string().required().label('Password'),
});

export default function Login() {
  const { search } = useLocation();
  const { error, loading, login } = useAuth(); // 👈 2, 4 en 5
  const navigate = useNavigate();

  // 👇 7
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: joiResolver(schema),
  });
  const { handleSubmit, reset } = methods; // 👈 1 en 6

  // 👇 6
  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  // 👇 1
  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password); // 👈 2
      // 👇 3
      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [login, navigate, search], // 👈 2 en 3
  );

  return (
    <FormProvider {...methods}>
      <div className='container'>
        <form
          className='d-flex flex-column'
          onSubmit={handleSubmit(handleLogin)}
        >
          {/* 👆 1 */}
          <h1>Sign in</h1>
          <Error error={error} />
          <LabelInput
            label='email'
            type='text'
            name='email'
            placeholder='your@email.com'
            data-cy='email_input'
          />
          <LabelInput
            label='password'
            type='password'
            name='password'
            data-cy='password_input'
          />
          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={loading}
                data-cy='submit_btn'
              >
                {/* 👆 4 */}
                Sign in
              </button>

              <button
                type='button'
                className='btn btn-light'
                onClick={handleCancel}
                
              >
                {/* 👆 6*/}
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
