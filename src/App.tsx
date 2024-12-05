import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, homeLoader } from './pages/home';
import { Layout } from './components/layout';
import {
  dummiesLoader,
  DummiesList,
  dummiesAction,
} from './pages/dummy-data-page';
import SignInPage from './pages/signin';
import { AuthWrapper } from './components/auth';
import SignOutPage from './pages/signout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: Home,
      },
      {
        path: 'signin',
        // ErrorBoundary: CandidatedummyLoaderBoundary,
        children: [
          {
            index: true,
            Component: SignInPage,
          },
        ],
      },
      {
        path: 'signout',
        // ErrorBoundary: CandidatedummyLoaderBoundary,
        children: [
          {
            index: true,
            Component: SignOutPage,
          },
        ],
      },
      {
        path: 'dummy-data-page',
        // ErrorBoundary: CandidatedummyLoaderBoundary,
        Component: AuthWrapper,
        children: [
          {
            index: true,
            action: dummiesAction,
            loader: dummiesLoader,
            Component: DummiesList,
          },
        ],
      },
    ],
  },
]);

export function Fallback() {
  return <p>Performing initial data load</p>;
}

function App() {
  return <RouterProvider router={router} fallbackElement={<Fallback />} />;
}

export default App;
