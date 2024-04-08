import { createBrowserRouter } from "react-router-dom";
import AccountList from "../pages/AccountList/page";
import NotFoundPage from "../pages/NotFoundPage";
import AccountMut from "../pages/AccountMut/page";



export const router = createBrowserRouter([
  {
    path: '/',
    element: <AccountList />,
    errorElement: <NotFoundPage />
  },

  {
    path: '/mutation/:id',
    element: <AccountMut />,
    errorElement: <NotFoundPage />
  },

])