import React from 'react';

export const SignOut = () => {
  sessionStorage.removeItem('accessToken');
  window.location.href = '/';
  return <></>;
};
