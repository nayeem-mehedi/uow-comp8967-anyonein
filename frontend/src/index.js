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
import Searchproject from './components/pages/Search/Searchproject';
import Logout from './components/pages/Logout/Logout';
import EditProfile from './components/pages/Profile/EditProfile';
import AdminProfile from './components/pages/AdminProfile/AdminProfile';
import Projects from './components/pages/Projects/Projects';
import ProjectDetails from './components/pages/Projects/ProjectDetails';

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
<<<<<<< HEAD
    path: "/searchproject",
    element: <Searchproject/>
=======
    path:"/edit-profile/:id",
    element:<EditProfile/>,
  },
  {
    path: "/admin",
    element: <AdminProfile />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/projects/:id",
    element: <ProjectDetails />,
>>>>>>> f18677411dd2eb83101c4a87844e9210ad023d28
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

