import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
  changeUserCategory,
  createSeller,
  getAdminUsers,
  getCategories,
  resetPassword,
  validateToken,
} from "../../helpers/serverCalls";
import { errorToast, successToast } from "../../helpers/toasts";
import { useNavigate } from "react-router-dom";
import Container from "../../helpers/Container";

const USER_DATA = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  role: "SELLER",
  cpf: "",
  categoryId: 1,
};

export default function UsersPage() {
  const [users, setUsers] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    password: string;
  } | null>(null);
  const [creatingUser, setCreatingUser] = useState(USER_DATA);
  const [showEditModal, setShowEditModal] = useState(false);
  const dataFetchedRef = useRef(false);
  const [isLoading, setLoading] = useState(true);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

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
    loadData();
  }, []);

  const loadData = () => {
    getAdminUsers().then((userData) => {
      setUsers(userData);
    });
    getCategories().then((cat) => setCategories(cat));
  };

  const handleCreateSeller = () => {
    const userData = {
      username: creatingUser.username,
      password: creatingUser.password,
      email: creatingUser.email,
      role: creatingUser.role,
      name: `Vend.${creatingUser.username}`,
      cpf: creatingUser.cpf,
      categoryId: creatingUser.categoryId,
    };
    createSeller(userData)
      .then(() => {
        successToast("Vendedor criado!");
        loadData();
        setIsCreatingUser(false);
        setCreatingUser(USER_DATA);
      })
      .catch((e) => errorToast(e.message));
  };

  const handleResetPassword = (user: any) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const hideModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleSaveChanges = () => {
    resetPassword(editingUser!.id, editingUser!.password)
      .then(() => {
        setShowEditModal(false);
        successToast("Senha alterada!");
      })
      .catch((error: any) => {
        errorToast(error.message);
      });
  };

  const handleChangeCategory = (id: string, categoryId: number) => {
    changeUserCategory(id, categoryId)
      .then(() => {
        setShowEditModal(false);
        successToast("Categoria atualizada");
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
        <Button onClick={() => setIsCreatingUser(true)}>Criar Vendedor</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Categoria</th>
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
                <td>
                  {user.id !== 1 ? (
                    <select
                      value={user.categoryId}
                      onChange={({ target: { value } }) =>
                        handleChangeCategory(user.id, Number(value))
                      }
                    >
                      {categories.map(
                        ({ id, name }: { id: string; name: string }) => {
                          return (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          );
                        }
                      )}
                    </select>
                  ) : (
                    <select disabled>
                      <option>Todos</option>
                    </select>
                  )}
                </td>
                <td>
                  <Button onClick={() => handleResetPassword(user)}>
                    Resetar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

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
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {creatingUser && (
        <Modal show={isCreatingUser} onHide={() => setIsCreatingUser(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome de usuário"
                  value={creatingUser!.username}
                  onChange={({ target: { value } }) =>
                    setCreatingUser((prev) => ({ ...prev!, username: value }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Senha:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Senha"
                  value={creatingUser!.password}
                  onChange={({ target: { value } }) =>
                    setCreatingUser((prev) => ({ ...prev!, password: value }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirmar senha:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Senha"
                  value={creatingUser!.confirmPassword}
                  onChange={({ target: { value } }) =>
                    setCreatingUser((prev) => ({
                      ...prev!,
                      confirmPassword: value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  value={creatingUser!.email}
                  onChange={({ target: { value } }) =>
                    setCreatingUser((prev) => ({
                      ...prev!,
                      email: value,
                    }))
                  }
                />
                <Form.Label>CPF:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="12345678977"
                  value={creatingUser!.cpf}
                  onChange={({ target: { value } }) =>
                    setCreatingUser((prev) => ({ ...prev!, cpf: value }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Categoria:</Form.Label>
                <Form.Select
                  value={creatingUser!.categoryId}
                  onChange={({ target: { value } }) =>
                    setCreatingUser((prev) => ({
                      ...prev!,
                      categoryId: Number(value),
                    }))
                  }
                >
                  {categories.map(
                    ({ id, name }: { id: string; name: string }) => {
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    }
                  )}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setIsCreatingUser(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSeller}
              disabled={
                creatingUser.password !== creatingUser.confirmPassword ||
                creatingUser.password.length < 6
              }
            >
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
