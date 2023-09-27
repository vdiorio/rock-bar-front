import { Command } from "../../../interfaces";
import ListGroup from "react-bootstrap/ListGroup";

export default function CommandCard({ command }: { command: Command }) {
  const { id, value } = command;
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-start"
      action
      href={`/admin/command/${id}`}
      style={{ borderRadius: "5px" }}
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">{`Comanda: ${id}`}</div>
        {`Valor: R$ ${value.toFixed(2)}`}
      </div>
    </ListGroup.Item>
  );
}
