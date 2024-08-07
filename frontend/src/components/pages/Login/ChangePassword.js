import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from 'axios';
import {useUserDispatch} from "../../context/UserContext";
import Navbar from "../../ui/Navbar";

function ChangePassword() {
  const dispatch = useUserDispatch();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added state for confirm password
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    // Get the token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No authentication token found.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:9001/api/users/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`, // Use the Basic token
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to change password");
      }

      setMessage("Password changed successfully.");
      dispatch({type: 'LOGOUT'});
      // Clear the token from localStorage
      localStorage.removeItem('token');
      navigate("/login"); // Redirect to login after successful change
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <>
    <div className="general-bg">
    <Navbar />

<div className="login-container">
      <div className="login-content">
        <div className="back">
          <NavLink to={-1} className="grey-btn back-btn">Go Back</NavLink>
        </div>
        <h1>Change Password</h1>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="oldPassword">Old Password:</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Change Password</button>
          </form>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default ChangePassword;
