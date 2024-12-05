import { Outlet } from 'react-router-dom';
import React from 'react';
import { NavBar } from '../navbar';

export function Layout() {
  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-screen-lg py-12">
        <Outlet />
      </div>
    </div>
  );
}
