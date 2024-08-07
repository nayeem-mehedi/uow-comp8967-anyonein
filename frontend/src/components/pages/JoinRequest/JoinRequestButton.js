import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSnackbar } from 'notistack';

function JoinRequestModal({ projectId, succFunc }) {
    const finalJoinReqUrl = `http://localhost:9001/api/projects/${projectId}/join`;
    const [message, setMessage] = useState('');

    const token = localStorage.getItem("token");
    const { enqueueSnackbar } = useSnackbar();

    const handleJoinRequest = async () => {
        try {
            const response = await fetch(
                finalJoinReqUrl,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${token}`,
                    },
                    body: JSON.stringify({ message }),
                });


            if (!response.ok) {
                enqueueSnackbar('Join Request sending failed', { variant: 'error' });
                console.error("Error sending join request", response.statusText);
            } else {
                enqueueSnackbar('Join Request sent successfully', { variant: 'success' });
                succFunc()
            }
        } catch (error) {
            enqueueSnackbar("Join Request sending failed", { variant: 'error' });
            console.error("Error sending join request", error);
        }
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Project Join Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formMessage">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="main-btn-alt" variant="primary" onClick={handleJoinRequest}>
                    Send Request
                </Button>
            </Modal.Footer>
        </>
    )
}


const JoinRequestButton = ({projectId}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="joinRequestButtonSection mt-2 mb-2 ">
                <Button onClick={() => setShowModal(true)} className="main-btn-alt">Join Project</Button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <JoinRequestModal
                    succFunc={() => {
                        setShowModal(false);
                    }}
                    projectId={projectId} />
            </Modal>
        </>

    )
}

export default JoinRequestButton;