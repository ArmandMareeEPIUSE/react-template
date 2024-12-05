import React, { useState } from 'react';
import { signIn } from '../../components/auth/authService';
import { Typography } from '@material-tailwind/react';
import { Form } from 'react-router-dom';

export const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const signInResponse = await signIn(email, password, newPassword);
      console.log('Sign in successful', signInResponse);

      if (signInResponse?.err === 'new_password_required') {
        setNewPasswordRequired(true);
      } else if (signInResponse.payload?.jwt) {
        sessionStorage.setItem('accessToken', signInResponse.payload.jwt);

        if (sessionStorage.getItem('accessToken')) {
          window.location.href = '/';
        } else {
          const err = 'Session token was not set properly.';
          setErrorMessage(err);
          console.error(err);
        }
      } else {
        const err =
          signInResponse.err.message ??
          'Sign in failed. No error or jwt returned.';
        setErrorMessage(err);
        console.error(err);
      }
    } catch (error) {
      const err = `Sign in failed: ${error}`;
      setErrorMessage(err);
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mx-4 mt-4 ">
        <div className="flex items-center justify-between">
          <Typography variant="h2" className="mb-2 text-eu-heading">
            Sign In
          </Typography>
        </div>
        {errorMessage ? (
          <div
            role="alert"
            className="mb-4 relative flex w-full p-3 text-sm text-white bg-red-600 rounded-md"
          >
            {errorMessage}
          </div>
        ) : null}
        <Form onSubmit={handleSignIn}>
          <div className="w-full max-w-md min-w-[200px]">
            <div className="flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-transparent mb-3 text-eu-body placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>
            <div className="flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-transparent mb-3 text-eu-body placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
            </div>
            {newPasswordRequired && (
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full bg-transparent mb-3 text-eu-body placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                />
              </div>
            )}
          </div>
          <button
            className="rounded-md bg-eu-red py-2 px-4 border border-transparent text-center font-sans text-xs font-bold uppercase text-white shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            {newPasswordRequired ? 'Change Password' : 'Sign In'}
          </button>
        </Form>
      </div>
    </div>
  );
};
