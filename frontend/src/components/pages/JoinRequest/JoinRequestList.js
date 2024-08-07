import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { useSnackbar } from 'notistack';

const JoinRequestsList = ({ projectId }) => {
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false); // Track if the user is the owner
    const { enqueueSnackbar } = useSnackbar();
    const token = localStorage.getItem("token");

    // Function to fetch project details and determine if the current user is the owner
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9001/api/projects/${projectId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }

                const data = await response.json();
                const currentUserResponse = await fetch(
                    `http://localhost:9001/api/profiles/self`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${token}`,
                        },
                    }
                );

                if (!currentUserResponse.ok) {
                    throw new Error("Failed to fetch current user profile");
                }

                const currentUser = await currentUserResponse.json();
                setIsOwner(data.owner.id === currentUser.user.id); // Check if the logged-in user is the owner
            } catch (error) {
                setError(error.message);
                enqueueSnackbar('Failed to fetch project details', { variant: 'error' });
            }
        };

        fetchProjectDetails();
    }, [projectId, token, enqueueSnackbar]);

    // Fetch join requests only if the user is the owner
    useEffect(() => {
        if (!isOwner) {
            setLoading(false); // Set loading to false if not the owner
            return;
        }

        const fetchJoinRequests = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9001/api/projects/${projectId}/join-requests`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch join requests');
                }

                const data = await response.json();
                setJoinRequests(data);
            } catch (error) {
                setError(error.message);
                enqueueSnackbar('Failed to load join requests', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchJoinRequests();
    }, [projectId, isOwner, token, enqueueSnackbar]);

    const handleRequestAction = async (joinRequestId, action) => {
        try {
            const response = await fetch(
                `http://localhost:9001/api/projects/join-requests/${joinRequestId}`,
                {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${token}`,
                    },
                    body: JSON.stringify({ status: action }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update join request');
            }

            // Update local state to reflect changes
            setJoinRequests(prevRequests =>
                prevRequests.map(request =>
                    request.id === joinRequestId ? { ...request, status: action } : request
                )
            );

            enqueueSnackbar(`Join request ${action}ed successfully`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update join request', { variant: 'error' });
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!isOwner) {
        return null; // Do not render anything if not the owner
    }

    return (
        <div className="join-requests-div">
            <h3>Join Requests</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {joinRequests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.user?.username || 'Unknown'}</td>
                            <td>{request.message}</td>
                            <td>{request.status}</td>
                            <td>
                                {request.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => handleRequestAction(request.id, 'accepted')}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleRequestAction(request.id, 'rejected')}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default JoinRequestsList;
