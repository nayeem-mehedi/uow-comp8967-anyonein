import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        }

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
                // Clear the token from localStorage
                localStorage.removeItem('token');
                // Redirect to the login page
                navigate('/login');
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