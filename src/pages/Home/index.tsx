import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { getCommandsById } from "../../helpers/serverCalls";
import { errorToast } from "../../helpers/toasts";
import { CommandData } from "../../interfaces";
import "./homepage.css";

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
  const queryParams = new URLSearchParams(window.location.search);
  const commandId = queryParams.get("id");
  const navigate = useNavigate();

  const fourDigitId = (id: number) => String(id).padStart(4, "0");

  useEffect(() => {
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
              status: "OK",
            };
          });
          const retiradas = com.productOrders.map((o) => {
            const status = o.status === "OK" ? "OK" : "Cancelado";
            return {
              id: o.id,
              type: "retirada",
              value: o.value,
              date: o.orderedAt,
              status,
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
  }, [commandId, navigate]);

  function formatDateString(inputString: string) {
    const inputDate = new Date(inputString);
    const day = inputDate.getDate().toString().padStart(2, "0");
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const hours = inputDate.getHours().toString().padStart(2, "0");
    const minutes = inputDate.getMinutes().toString().padStart(2, "0");

    return `${day}/${month} ${hours}:${minutes}`;
  }

  return (
    <div className="home-container">
      <Button href="/login" className="login-link">
        Log in
      </Button>
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
        </>
      )}
      {transactions && (
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
              const color = isDebit ? "red" : "lime";
              const minusSign = isDebit ? "-" : "";
              const textDecoration =
                tr.status === "OK" ? "none" : "line-through";
              return (
                <tr key={tr.id}>
                  <td style={{ textDecoration }}>{tr.id}</td>
                  <td style={{ color, textDecoration }}>
                    {minusSign}R$ {tr.value.toFixed(2)}
                  </td>
                  <td style={{ textDecoration }}>
                    {formatDateString(tr.date)}
                  </td>
                  <td style={{ textDecoration }}>{tr.status}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
