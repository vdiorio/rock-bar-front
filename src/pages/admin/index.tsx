import React, { useEffect, useRef, useState } from "react";
import CommandCard from "./components/CommandCard";
import { Command } from "../../interfaces";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  createOrder,
  getCommands,
  validateRole,
} from "../../helpers/serverCalls";
import { redirectAndClearStorage } from "../../helpers/redirect";
import { useNavigate } from "react-router-dom";
import Container from "../../helpers/Container";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";
import { errorToast, successToast } from "../../helpers/toasts";
import Header from "./components/Header";

export default function AdminPage() {
  const [commands, setCommands] = useState<Command[] | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false);
  const [commandId, setCommandId] = useState("");
  const [commandName, setCommandName] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrderValue, setNewOrderValue] = useState("0.00");

  const handleRadioChange = (value: string) => {
    setCommandId(value);
    setCommandName("");
  };

  const handleCustomNameChange = (value: string) => {
    setCommandName(value);
  };

  const setSearchAndPage = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    validateRole("ADMIN")
      .then(() => {
        getCommands()
          .then((commands) => setCommands(commands))
          .catch(() => redirectAndClearStorage(navigate));
      })
      .catch(() => redirectAndClearStorage(navigate))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCloseModal = () => {
    setIsCreatingOrder(false);
    setNewOrderValue("");
  };

  const handleSaveOrder = () => {
    createOrder(commandId, newOrderValue, commandName)
      .then(() => {
        updateCommands();
        successToast("Pedido criado!");
        setIsCreatingOrder(false);
        setNewOrderValue("0.00");
        setCommandName("");
      })
      .catch((err) => errorToast(err.message));
  };

  const updateCommands = async () => {
    getCommands()
      .then((commands) => setCommands(commands))
      .catch(({ message }) => errorToast(message));
  };

  return (
    <>
      <Header />
      <Container isLoading={isLoading}>
        <div id="reader" />
        <Form.Control
          type="text"
          value={search}
          onChange={setSearchAndPage}
          placeholder="Filtrar Comandas"
        />
        <Button onClick={() => setIsCreatingOrder(true)}>Criar Pedido</Button>
        <Card
          className="container"
          style={{
            height: "80vh",
            overflowX: "hidden",
            overflowY: "scroll",
            backgroundColor: "#090919",
          }}
        >
          <ListGroup style={{ gap: "2px" }}>
            {commands &&
              commands!
                .filter((c) => {
                  return String(c.id).startsWith(search);
                })
                .map((command) => {
                  return <CommandCard command={command} />;
                })}
          </ListGroup>
        </Card>
        <Modal show={isCreatingOrder} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Novo Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Id da comanda</Form.Label>
              <Form.Control
                onChange={({ target: { value } }) => setCommandId(value)}
              />
              <Form.Label>Nome de extorno</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Inalterado"
                  id="radioInalterado"
                  name="radioOption"
                  value="inalterado"
                  checked={commandId !== "outraOpcao"}
                  onChange={({ target: { value } }) => handleRadioChange(value)}
                />
                <Form.Check
                  type="radio"
                  label="Novo nome"
                  id="radioOutraOpcao"
                  name="radioOption"
                  value="outraOpcao"
                  checked={commandId === "outraOpcao"}
                  onChange={({ target: { value } }) => handleRadioChange(value)}
                />
              </div>
              {commandId === "outraOpcao" && (
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Digite um nome personalizado"
                    value={commandName}
                    onChange={({ target: { value } }) =>
                      handleCustomNameChange(value)
                    }
                  />
                </InputGroup>
              )}
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
      </Container>
    </>
  );
}
