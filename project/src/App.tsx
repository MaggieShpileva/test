import type { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { Tasks } from './pages/Tasks';
import { NotFound } from './pages/NotFound';
import { Error } from './pages/Error';
import { Layout } from './components/Feature';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tasks',
        element: <Tasks />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export const App: FC = () => {
  return <RouterProvider router={router} />;
};
