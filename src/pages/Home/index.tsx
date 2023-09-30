import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { getCommandsById } from "../../helpers/serverCalls";
import { errorToast } from "../../helpers/toasts";
import { CommandData } from "../../interfaces";
import "./homepage.css";
import PixModal from "./Components/PixModal";
import PixInfoModal from "./Components/PixInfoModal";
import formatDate from "../../helpers/formatDate";

export default function Home() {
  const [transactions, setTransactions] = useState<
    | {
        id: number;
        type: string;
        value: number;
        date: string;
        status: string;
      }[]
    | null
  >(null);
  const [command, setCommand] = useState<CommandData | null>(null);
  const [show, setShow] = useState(false);
  const [pixOrder, setPixOrder] = useState<number | null>(null);
  const queryParams = new URLSearchParams(window.location.search);
  const commandId = queryParams.get("q");
  const navigate = useNavigate();

  const fourDigitId = (id: number) => String(id).padStart(4, "0");

  const refreshCommand = async () => {
    if (commandId) {
      getCommandsById(commandId)
        .then((com) => {
          setCommand(com);
          const recargas = com.orders.map((o) => {
            return {
              id: o.id,
              value: o.value,
              type: "recarga",
              date: o.orderedAt,
              status: o.status,
            };
          });
          const retiradas = com.productOrders.map((o) => {
            return {
              id: o.id,
              type: "retirada",
              value: o.value,
              date: o.orderedAt,
              status: o.status,
            };
          });
          const tr = [...retiradas, ...recargas].sort((b, a) =>
            a.date.localeCompare(b.date)
          );
          setTransactions(tr);
        })
        .catch(({ message }) => {
          errorToast(message);
          navigate("/");
        });
    }
  };

  useEffect(() => {
    refreshCommand();
  }, []);

  function statusTraslate(status: string) {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return "OK";
    }
  }

  return (
    <div className="home-container">
      <img
        className="logo"
        src={require("../../fotos/LOGO.png")}
        alt="Logo do rock bar"
      />
      {command && (
        <>
          <div className="text-container">
            <h2>ID:</h2>
            <h2>{fourDigitId(command!.id)}</h2>
          </div>
          <div className="text-container">
            <h2>Valor:</h2>
            <h2 style={{ color: "green" }}>{`R$ ${command!.value.toFixed(
              2
            )}`}</h2>
          </div>
          <div className="pix-container">
            <img className="pix" src={require("./pix.png")} alt="Logo do pix" />
            <br />
            <h1>
              Evite filas!
              <br />
              Recarregue sua comanda com PIX
            </h1>
            <Button onClick={() => setShow(true)}>Clique aqui!</Button>
          </div>
          <PixModal
            show={show}
            onHide={(orderId: number | null = null) => {
              setShow(false);
              refreshCommand();
              setPixOrder(orderId)
            }}
            commandId={commandId}
          />
          {pixOrder && (
            <PixInfoModal
              orderId={pixOrder}
              onHide={() => {
                setPixOrder(null);
                refreshCommand();
              }}
            />
          )}
        </>
      )}
      <></>
      {transactions && (
        <>
          <h1>Transações</h1>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <td>ID</td>
                <td>Valor</td>
                <td>Data</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tr) => {
                const isDebit = tr.type === "retirada";
                const isPending = tr.status === "PENDING";
                let color = "lime";
                if (isDebit) color = "red";
                if (isPending) color = "orange";
                const minusSign = isDebit ? "-" : "";
                const textDecoration =
                  tr.status === "CANCELLED" ? "line-through" : "none";
                return (
                  <tr
                    key={tr.id}
                    style={{
                      cursor: isPending ? "pointer" : "auto",
                    }}
                    onClick={isPending ? () => setPixOrder(tr.id) : () => {}}
                  >
                    <td style={{ textDecoration }}>{tr.id}</td>
                    <td style={{ color, textDecoration }}>
                      {minusSign}R$ {tr.value.toFixed(2)}
                    </td>
                    <td style={{ textDecoration }}>{formatDate(tr.date)}</td>
                    <td style={{ textDecoration }}>
                      {statusTraslate(tr.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}
