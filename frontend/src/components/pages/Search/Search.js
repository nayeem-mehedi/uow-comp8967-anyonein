import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from "../../ui/Navbar";
import {FOLLOW_TYPES, FollowButton} from "../Follow/FollowButton";
import {followUser} from "../../../helper/apiURL";

function Search(){
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:9001/api/search/user?query='+query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
      },
    });
    const data = await response.json();
    setResults(data.data);
  };

  if (!results) {
    return (
        <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
        </div>
    );
}

const viewBtnStyle = {
  paddingRight: "20px",
};

  return (
    <div className='general-bg'>
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col md="6">
            <h1 className="text-center search-h1">Search Users</h1>
            <Form className="search-form" onSubmit={handleSearch}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Name, username, skills"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" className='main-btn-alt' type="submit">
                Search
              </Button>
            </Form>
            <div className="mt-4">
              {results.map((user) => (
                <Card key={user.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                    <Card.Text>
                      <strong>Username:</strong> {user.username}<br />
                      <strong>Email:</strong> {user.email}<br />
                      <strong>Phone:</strong> {user.phone}<br />
                      {/* <strong>Role:</strong> {user.role}<br />
                      <strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}<br /> */}
                      <strong>Skills:</strong> {user.profile.skills.map(skill => skill.name).join(', ')}
                    </Card.Text>
                    <Button className='main-btn-alt' variant="primary" href={`/profile/${user.profile.id}`} style={viewBtnStyle}>
                      View Profile
                    </Button>
                    {/*FIXME: add follow status from API BE*/}
                    <FollowButton type={FOLLOW_TYPES.USER} followUrl={followUser} id={user.id} initialFollowing={false} />
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
   
  );
}

export default Search;