import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createOrder,
  getCommandsById,
  updateCommandData,
  validateRole,
} from "../../helpers/serverCalls";
import { useNavigate, useParams } from "react-router-dom";
import { errorToast, successToast } from "../../helpers/toasts";
import { CommandData } from "../../interfaces";
import { Button, Modal, Table, Form } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";
import { redirectAndClearStorage } from "../../helpers/redirect";
import "./commandPage.css";
import Header from "../admin/components/Header";

export default function CommandPage() {
  const { commandId } = useParams();
  const [command, setCommand] = useState<CommandData | null>(null);
  const dataFetchedRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("0.00");
  const [editedName, setEditedName] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrderValue, setNewOrderValue] = useState("0.00");

  const handleCreateOrder = () => {
    setIsCreatingOrder(true);
  };

  const handleCloseModal = () => {
    setIsCreatingOrder(false);
    setNewOrderValue("");
  };

  const handleSaveOrder = () => {
    createOrder(commandId!, newOrderValue)
      .then(() => {
        updateCommand();
        successToast("Pedido criado!");
        setIsCreatingOrder(false);
        setNewOrderValue(newOrderValue);
      })
      .catch((err) => errorToast(err.message));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    errorToast(
      "CUIDADO! Editar valores dessa forma pode gerar inconsistencias entre os valores pagos!"
    );
  };

  const handleSaveClick = () => {
    const value = Number(editedValue) - command!.value;
    updateCommandData(commandId!, value, editedName)
      .catch(({ message }) => errorToast(message))
      .then(() => {
        updateCommand();
        successToast("Dados atualizados!");
        setEditedValue("0.00");
        setIsEditing(false);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const navigate = useNavigate();

  const updateCommand = async () => {
    getCommandsById(commandId!)
      .then((command) => {
        setCommand(command);
        setEditedName(command.name);
        setEditedValue(String(command.value));
      })
      .catch(({ message }) => errorToast(message));
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    validateRole("ADMIN")
      .then(() => {
        getCommandsById(commandId!)
          .then((command) => {
            setCommand(command);
            setEditedName(command.name);
            setEditedValue(String(command.value));
          })
          .catch((e) => redirectAndClearStorage(navigate));
      })
      .catch(() => redirectAndClearStorage(navigate));
  }, [navigate, commandId]);

  function formatDate(stringDate: string) {
    const date = new Date(stringDate);
    const formattedDate = date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedDate;
  }

  return (
    <>
      <Header />
      {command && (
        <div className="mt-5 command-container">
          <h1 className="mb-4">Comanda: {commandId}</h1>
          {isEditing ? (
            <Form>
              <Form.Label>Valor</Form.Label>
              <CurrencyMaskedInput
                onChange={(e, value) => setEditedValue(value)}
                className="form-control"
                value={editedValue}
              />
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o novo nome"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <Button
                variant="primary"
                onClick={handleSaveClick}
                className="mt-3 me-2"
              >
                Salvar
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelClick}
                className="mt-3"
              >
                Cancelar
              </Button>
            </Form>
          ) : (
            <div>
              <p className="card-text">
                Valor atual: R$ {command.value.toFixed(2) + "  "}
                <br />
                Nome: {command.name || "Nenhum nome atribuido"}
                <br />
                <Button variant="primary" onClick={handleEditClick}>
                  Editar
                </Button>
              </p>
            </div>
          )}
          <Modal show={isCreatingOrder} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Criar Novo Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Valor do Pedido</Form.Label>
                <CurrencyMaskedInput
                  onChange={(e, value) => setNewOrderValue(value)}
                  className="form-control"
                  value={newOrderValue}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveOrder}>
                Salvar
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="mt-3">
            <h6 className="mt-3">
              Pedidos:
              <Button variant="primary" onClick={handleCreateOrder}>
                Criar novo
              </Button>
            </h6>
            <div className="table-container">
              <Table striped bordered hover size="sm" variant="dark">
                <thead>
                  <tr>
                    <th>Valor</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {command?.orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.value.toFixed(2)}</td>
                      <td>{formatDate(order.orderedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <h6 className="mt-3">Retiradas:</h6>
          <div className="mt-3">
            <div className="table-container">
              <Table size="sm" variant="dark" striped bordered hover>
                <thead style={{ position: "sticky" }}>
                  <tr>
                    <th>Pedido</th>
                    <th>Vendedor</th>
                    <th>Valor</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {command?.productOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.sellerId}</td>
                      <td>{order.value.toFixed(2)}</td>
                      <td>{formatDate(order.orderedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
