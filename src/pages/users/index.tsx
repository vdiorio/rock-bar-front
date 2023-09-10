import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
  getAdminUsers,
  resetPassword,
  validateToken,
} from "../../helpers/serverCalls";
import { errorToast, successToast } from "../../helpers/toasts";
import { useNavigate } from "react-router-dom";
import Container from "../../helpers/Container";

export default function UsersPage() {
  const [users, setUsers] = useState<any>([]);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    password: string;
  } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const dataFetchedRef = useRef(false);
  const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      validateToken()
        .catch(({ message }) => errorToast(message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    getAdminUsers().then((userData) => setUsers(userData));
  }, []);

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const hideModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleSaveChanges = () => {
    console.log("salve");
    resetPassword(editingUser!.id, editingUser!.password)
      .then(() => {
        setShowEditModal(false);
        successToast("Senha alterada!");
      })
      .catch((error: any) => {
        errorToast(error.message);
      });
  };

  return (
    <Container isLoading={isLoading}>
      <Card
        className="container"
        style={{ height: "80vh", overflowX: "hidden", overflowY: "scroll" }}
      >
        <h1>Painel de usuários administrativo</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Name</th>
              <th>CPF</th>
              <th>Senha</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.cpf}</td>
                <td>
                  <Button onClick={() => handleEditClick(user)}>Resetar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal show={showEditModal} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nova Senha"
                  value={editingUser!.password}
                  onChange={({ target: { value } }) =>
                    setEditingUser((prev) => ({ ...prev!, password: value }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
