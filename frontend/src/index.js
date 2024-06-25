import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css"
import App from './components/App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/pages/Login/Login"
import Landing from './components/pages/Landing/Landing';
import Signup from './components/pages/Signup/Signup';
import Profile from './components/pages/Profile/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

