import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
//import AccountList from "../pages/AccountList/page";
//import NotFoundPage from "../pages/NotFoundPage";
//import AccountMut from "../pages/AccountMut/page";

const AccountList = lazy(() => import('../pages/AccountList/page'));
const AccountMut = lazy(() => import('../pages/AccountMut/page'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));


export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AccountList />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>Loading Error Page...</div>}>
        <NotFoundPage />
      </Suspense>
    )
  },
  {
    path: '/mutation/:id',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AccountMut />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>Loading Error Page...</div>}>
        <NotFoundPage />
      </Suspense>
    )
  },
]);