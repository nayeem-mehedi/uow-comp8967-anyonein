import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import { useSnackbar } from 'notistack';

const ANNOUNCEMENT_TYPE = {
    PROJECT_ANNOUNCEMENT: 1,
    USER_ANNOUNCEMENT: 2,
}

const CreateAnnouncement = ({type = ANNOUNCEMENT_TYPE.USER_ANNOUNCEMENT, projectId = '', succFunc}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const token = localStorage.getItem("token");
    const { enqueueSnackbar } = useSnackbar();

    const userAnnUrl = 'http://localhost:9001/api/announcements/user';
    const projAnnUrl = 'http://localhost:9001/api/announcements/project';

    const handleCreateAnnouncement = async () => {
        try {
            const response = await fetch(
                type === ANNOUNCEMENT_TYPE.USER_ANNOUNCEMENT ? userAnnUrl : projAnnUrl,
                {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${token}`,
                },
                body: type === ANNOUNCEMENT_TYPE.USER_ANNOUNCEMENT
                    ? JSON.stringify({ title, content })
                    : JSON.stringify({ title, content, projectId }),
            });


            if (response.status === 401) {
                enqueueSnackbar('Not authorized to announce', { variant: 'error' });
                console.error("Unauthorized: Please check your authentication token.");
            } else if (!response.ok) {
                enqueueSnackbar('Announcement publishing failed', { variant: 'error' });
                console.error("Error creating announcement:", response.statusText);
            } else {
                enqueueSnackbar('Announcement published successfully', { variant: 'success' });
                succFunc()
            }
        } catch (error) {
            enqueueSnackbar('Announcement publishing failed', { variant: 'error' });
            console.error("Error creating announcement:", error);
        }
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Create Announcement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="green-btn-alt" variant="primary" onClick={handleCreateAnnouncement}>
                    Create Announcement
                </Button>
            </Modal.Footer>
        </>
    )
}

export { CreateAnnouncement, ANNOUNCEMENT_TYPE };