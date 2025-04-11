import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';
import { useThemeColors } from '../contexts/theme';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';
import PasswordStrengthBar from 'react-password-strength-bar';

const schema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().label('Name'),
  email: Joi.string().email({ tlds: { allow: tlds } }).required().label('Email'),
  password: Joi.string().min(12).required().label('Password'),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' })
    .label('Confirm Password'),
});

export default function Register() {
  const { theme, oppositeTheme } = useThemeColors();
  const { error, loading, register } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    resolver: joiResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleRegister = useCallback(
    async ({ name, email, password }) => {
      const loggedIn = await register({ name, email, password });
      if (loggedIn) {
        navigate({ pathname: '/', replace: true });
      }
    },
    [register, navigate],
  );

  return (
    <FormProvider {...methods}>
      <div className={`container bg-${theme} text-${oppositeTheme}`}>
        <form
          className='d-flex flex-column'
          onSubmit={handleSubmit(handleRegister)}
        >
          <h1>Register</h1>

          <Error error={error} />

          <LabelInput label='Name' type='text' name='name' placeholder='Your Name' />
          <LabelInput label='Email' type='text' name='email' placeholder='your@email.com' />
          <LabelInput label='Password' type='password' name='password' />
          <PasswordStrengthBar password={methods.watch('password')} />
          <LabelInput label='Confirm password' type='password' name='confirmPassword' />

          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isSubmitting || loading}
              >
                Register
              </button>

              <button
                type='button'
                className='btn btn-light'
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
