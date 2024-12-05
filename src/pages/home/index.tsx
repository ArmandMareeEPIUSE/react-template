import { Typography } from '@material-tailwind/react';
import React from 'react';

export async function homeLoader() {
  return {};
}

export function Home() {
  return (
    <>
      <Typography variant="h2" color="blue-gray" className="mb-2">
        Home
      </Typography>
    </>
  );
}
