/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createOrder,
  getCommandsById,
  updateCommandValue,
} from "../../helpers/serverCalls";
import { useParams } from "react-router-dom";
import { errorToast, successToast } from "../../helpers/toasts";
import { CommandData } from "../../interfaces";
import { Button, Modal, Table, Form } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";

export default function CommandPage() {
  const { commandId } = useParams();
  const [command, setCommand] = useState<CommandData | null>(null);
  const dataFetchedRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("0.00");
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
        setNewOrderValue("0.00");
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
    updateCommandValue(commandId!, value)
      .catch(({ message }) => errorToast(message))
      .then(() => {
        updateCommand();
        successToast("Valor atualizado!");
        setEditedValue("0.00");
        setIsEditing(false);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const updateCommand = async () => {
    getCommandsById(commandId!)
      .then((commands) => setCommand(commands))
      .catch(({ message }) => errorToast(message))
      .finally(() => console.log(command));
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    updateCommand();
  }, []);

  function formatDate(stringDate: string) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ás ${hours}:${minutes}`;
  }

  return (
    <>
      {command && (
        <div className="container mt-5">
          <div className="card mt-3">
            <div className="card-body">
              <h1>Comanda : {commandId}</h1>
              {isEditing ? (
                <Form>
                  <CurrencyMaskedInput
                    onChange={(e, value) => setEditedValue(value)}
                    className="form-control"
                    value={editedValue}
                  />
                  <Button variant="primary" onClick={handleSaveClick}>
                    Salvar
                  </Button>
                  <Button variant="secondary" onClick={handleCancelClick}>
                    Cancelar
                  </Button>
                </Form>
              ) : (
                <div>
                  <p className="card-text">
                    Valor atual: R$ {command.value.toFixed(2) + "  "}
                    <Button variant="primary" onClick={handleEditClick}>
                      Editar
                    </Button>
                  </p>
                </div>
              )}
              <h6 className="mt-3">
                Pedidos:{" "}
                <Button variant="primary" onClick={handleCreateOrder}>
                  Criar novo
                </Button>
                <Modal show={isCreatingOrder} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Criar Novo Pedido</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="orderValue">
                        <Form.Label>Valor do Pedido</Form.Label>
                        <CurrencyMaskedInput
                          value={newOrderValue}
                          onChange={(e, value) => setNewOrderValue(value)}
                          className="form-control"
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveOrder}
                      disabled={Number(newOrderValue) <= 0}
                    >
                      Salvar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </h6>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Valor</th>
                      <th>Data e hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {command.orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.value}</td>
                        <td>{formatDate(order.orderedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <h6 className="mt-3">Retiradas:</h6>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {command.products.map((product) => (
                      <tr key={product.orderedAt}>
                        <td>{product.productName}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
