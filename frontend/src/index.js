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
import Search from './components/pages/Search/Search';
import Logout from './components/pages/Logout/Logout';
import GetSkills from './components/pages/Skills/getSkills';
import DeleteSkill from './components/pages/Skills/deleteSkill'
import AddSkill from './components/pages/Skills/addSkill'

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
    path: "/logout",
    element: <Logout />

  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/getSkills",
    element: <GetSkills />,
  },
  {
    path: "/deleteSkill",
    element: <DeleteSkill />,
  },
  {
    path: "/AddSkill",
    element: <AddSkill />,
  }

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

