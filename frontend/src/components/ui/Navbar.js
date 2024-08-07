import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationBadge from "../pages/Notification/NotificationBadge";
import ProfileDropdown from './ProfileDropdown';
import { useUserState } from '../context/UserContext';
// import {isLoggedIn} from "../../helper/auth";

function Navbar() {
  const { profile, loggedIn } = useUserState();
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       if (loggedIn){
  //         const response = await fetch(`http://localhost:9001/api/profiles/self`, {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Basic ${token}`,
  //           },
  //         });
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         const data = await response.json();
  //         setProfile(data);
  //         setLoggedIn(true);
  //       } else {
  //         navigate('/login');
  //       }
  //
  //     } catch (error) {
  //       // setError(error);
  //       console.log("[ERROR] not logged in", error);
  //       setLoggedIn(false);
  //       navigate('/login');
  //     }
  //   };
  //
  //   fetchProfile()
  // }, [token, profile]);

  const loggedInItems = isLoggedIn ? <>
    <NavLink to="/feed" className="nav-items">Feed</NavLink>
    <NavLink to="/search" className="nav-items">Search Users</NavLink>
    <NavLink to="/searchproject" className="nav-items">Search Projects</NavLink>
    <NavLink to="/projects" className="nav-items">Projects</NavLink>
    <NavLink to="/announcement" className="nav-items">Announcements</NavLink>
    <NavLink to="/follow-list" className="nav-items">Follow List</NavLink>
    <NotificationBadge />
  </> : <> <NavLink to="/landing" className="nav-items">Home</NavLink></>

  // const ProfileDropdown = loggedIn ? <>
  //   <Dropdown as={ButtonGroup}>
  //     <Dropdown.Toggle className="grey-btn"></Dropdown.Toggle>
  //     <Dropdown.Menu>
  //       <Dropdown.Item className="nav-items-alt">
  //         <NavLink to="/profile/self" className="nav-items-alt">View Profile</NavLink>
  //       </Dropdown.Item>
  //       <Dropdown.Item className="nav-items-alt">
  //         <NavLink to="/logout" className="nav-items-alt">Logout</NavLink>
  //       </Dropdown.Item>
  //     </Dropdown.Menu>
  //   </Dropdown>
  // </> : <><NavLink to="/login" className="main-btn">Login</NavLink></>

  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="nav-links">

          {loggedInItems}
          {/*<NavLink to="/about" className="nav-items">About Us</NavLink>*/}
          {/*<NavLink to="/contact" className="nav-items">Contact Us</NavLink>*/}
        </div>
        <div className="d-flex">
          <ProfileDropdown loggedIn={loggedIn} profile={profile}/>
        </div>
      </nav>
    </div>
);
}

export default Navbar;