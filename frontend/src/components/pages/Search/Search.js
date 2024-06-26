import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

function Search(){
    const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch('https://api.example.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    setResults(data.data);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h1 className="text-center search-h1">Search Users</h1>
          <Form className="search-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
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
                    <strong>Role:</strong> {user.role}<br />
                    <strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}<br />
                    <strong>Skills:</strong> {user.profile.skills.map(skill => skill.name).join(', ')}
                  </Card.Text>
                  <Button variant="primary" href={`/profile/${user.id}`}>
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Search;