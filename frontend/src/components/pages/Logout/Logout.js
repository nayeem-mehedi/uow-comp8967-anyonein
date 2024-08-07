import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {useUserDispatch} from "../../context/UserContext";

const Logout = () => {
    const dispatch = useUserDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        // Function to handle logout
        const handleLogout = async () => {
            try {
                // Make the logout API call if necessary
                await axios.post('http://localhost:9001/api/auth/logout', null, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                dispatch({type: 'LOGOUT'});
                // Clear the token from localStorage
                localStorage.removeItem('token');
                // Redirect to the login page
                navigate('/landing');
            }
        };

        handleLogout();
    }, [navigate]);


    return (
        <div>
            Logging out...
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Logout;