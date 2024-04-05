
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AccountList from './pages/AccountList/page';
import NotFoundPage from './pages/NotFoundPage';
import AccountMutation from './pages/AccountMut/page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AccountList />,
    errorElement: <NotFoundPage />
  },

  {
    path: '/mutation/:id',
    element: <AccountMutation />,
    errorElement: <NotFoundPage />
  },

])


function App() {

  return (
    <>
      <RouterProvider router={router} />

    </>
  );
}

export default App;
