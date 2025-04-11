import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import Layout from './pages/Layout.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';

import PlayersList from './pages/players/PlayersList.jsx';
import PlayerDetail from './pages/players/PlayerDetail.jsx';
import AddOrEditPlayer from './pages/players/AddOrEditPlayer.jsx';

import TeamsList from './pages/teams/TeamsList.jsx';
import TeamDetail from './pages/teams/TeamDetail.jsx';
import AddOrEditTeam from './pages/teams/AddOrEditTeam.jsx';
import AddPlayerToTeam from './pages/teams/AddPlayerToTeam.jsx';

import AddOrEditStat from './pages/stats/AddOrEditStat.jsx';

import UsersList from './pages/users/UsersList.jsx';
import UserDetail from './pages/users/UserDetail.jsx';
import EditUser from './pages/users/EditUser.jsx';

import { ThemeProvider } from './contexts/Theme.context.jsx';
import { AuthProvider } from './contexts/Auth.context.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <App />,
          },
        ],
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      { path: '*', element: <NotFound /> },
      {
        path: 'players',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <PlayersList />,
          },
          {
            path: ':playerId',
            children: [
              {
                index: true,
                element: <PlayerDetail />,
              },
              {
                path: 'stats/add',
                element: <AddOrEditStat />,
              },
              {
                path: 'stats/edit/:statId',
                element: <AddOrEditStat />,
              },
            ],
          },
          {
            path: 'add',
            element: <AddOrEditPlayer />,
          },
          {
            path: 'edit/:playerId',
            element: <AddOrEditPlayer />,
          },
        ],
      },
      {
        path: 'teams',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <TeamsList />,
          },
          {
            path: ':teamId',
            children: [
              {
                index: true,
                element: <TeamDetail />,
              },
              {
                path: 'players/add',
                element: <AddPlayerToTeam />,
              },
            ],
          },
          {
            path: 'add',
            element: <AddOrEditTeam />,
          },
          {
            path: 'edit/:teamId',
            element: <AddOrEditTeam />,
          },
        ],
      },
      {
        path: 'users',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <UsersList />,
          },
          {
            path: ':userId',
            element: <UserDetail />,
          },
          {
            path: 'edit/:userId',
            element: <EditUser />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
