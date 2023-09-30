import React, { useEffect, useRef, useState } from "react";
import "./OrdersPage.css";
import { Order } from "../../interfaces";
import { getOrders, validateRole } from "../../helpers/serverCalls";
import { errorToast } from "../../helpers/toasts";
import { Button, Table, Form } from "react-bootstrap";
import Header from "../admin/components/Header";
import OrderCard from "./components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [searchId, setSearchId] = useState("");
  const [filter, setFilter] = useState("");
  const dataFetchedRef = useRef(false);

  const updateOrders = () => {
    getOrders()
      .then((orders) => setOrders(orders))
      .catch(({ message }) => errorToast(message));
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    validateRole("ADMIN").then(updateOrders);
  }, []);

  // Handle searching by ID
  const handleSearchById = () => {
    const filteredOrders = orders!.filter((order) =>
      order.id.toString().includes(searchId)
    );
    setOrders(filteredOrders);
  };

  // Reset the table to its original state
  const resetTable = () => {
    setSearchId("");
    setFilter("");
    updateOrders();
  };

  return (
    <>
      <Header />
      <h3>Pedidos:</h3>
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearchById}>
            Search
          </Button>
        </Form.Group>
      </Form>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <td>ID</td>
            <td>Comanda</td>
            <td>Valor</td>
            <td>
              Status:{" "}
              <select onChange={({ target: { value } }) => setFilter(value)}>
                <option value="">Todas</option>
                <option value="PAID">Pago</option>
                <option value="PENDING">Pendente</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </td>
            <td>Data</td>
            <td>Ações</td>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders
              .filter((o) => o.status.includes(filter))
              .map((order) => {
                return <OrderCard order={order} update={updateOrders} />;
              })}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={resetTable}>
        Reset
      </Button>
    </>
  );
}
