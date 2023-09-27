import { Button, ButtonGroup } from "react-bootstrap";
import { CommandData } from "../../interfaces";
import { useState } from "react";

export default function CommandInfo({ command }: { command: CommandData }) {
  const [selected, setSelected] = useState("valor");

  const fourDigitId = (id: number) => {
    let result = String(id);
    while (result.length < 4) {
      result = "0" + result;
    }
    return result;
  };

  return (
    <>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary" onClick={() => setSelected("valor")}>
          Valor
        </Button>
        <Button variant="secondary" onClick={() => setSelected("recarga")}>
          Recargas
        </Button>
        <Button variant="secondary" onClick={() => setSelected("pedidos")}>
          Pedidos
        </Button>
      </ButtonGroup>
      {selected === "valor" && (
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
      {selected === "recarga" &&
        command.orders.map((o) => {
          return (
            <div key={o.id}>
              <p>Valor: {o.value}</p>
              <p>Data e hora: {o.orderedAt}</p>
            </div>
          );
        })}
      {selected === "pedidos" &&
        command.productOrders.map((o) => {
          return (
            <div key={o.id}>
              <p>Valor: {o.value}</p>
              <p>Data e hora: {o.orderedAt}</p>
            </div>
          );
        })}
    </>
  );
}
