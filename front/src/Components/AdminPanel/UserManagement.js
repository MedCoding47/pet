import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Alert, Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      is_admin: user.is_admin
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        });
        setUsers(users.filter(user => user.id !== userId));
        setError('');
      } catch (err) {
        setError('Failed to delete user: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      };

      if (currentUser) {
        // Remove password field if empty to avoid updating with empty password
        const dataToSend = {...formData};
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        
        await axios.put(
          `http://localhost:8000/api/users/${currentUser.id}`,
          dataToSend,
          config
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/users',
          formData,
          config
        );
      }
      
      await fetchUsers();
      setShowModal(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-4">Loading users...</div>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">User Management</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={() => {
            setCurrentUser(null);
            setFormData({ name: '', email: '', password: '', is_admin: false });
            setShowModal(true);
          }}>
            Add New User
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.is_admin ? (
                      <Badge bg="danger">Admin</Badge>
                    ) : (
                      <Badge bg="success">User</Badge>
                    )}
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => handleEdit(user)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edit User' : 'Create User'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={currentUser ? "Leave blank to keep current password" : ""}
                required={!currentUser}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="is-admin-switch"
                label="Admin Privileges"
                name="is_admin"
                checked={formData.is_admin}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentUser ? 'Update User' : 'Create User'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserManagement;