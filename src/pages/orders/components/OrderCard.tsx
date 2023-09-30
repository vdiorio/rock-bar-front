import { Order } from "../../../interfaces";
import { Button } from "react-bootstrap";
import formatDate from "../../../helpers/formatDate";
import { cancelOrder, confirmOrder } from "../../../helpers/serverCalls";
import { errorToast, successToast } from "../../../helpers/toasts";
import { useState } from "react";

export default function OrderCard({
  order,
  update,
}: {
  order: Order;
  update: () => void;
}) {
  const [isLoading, setLoading] = useState(false);

  const handleConfirm = (orderId: number) => {
    setLoading(true);
    confirmOrder(orderId)
      .then(() => {
        successToast(`Pedido ${orderId} Confirmado!`);
        update();
      })
      .catch((e) => errorToast(e.message))
      .finally(() => setLoading(false));
  };

  const handleCancel = (orderId: number) => {
    setLoading(true);
    cancelOrder(orderId)
      .then(() => {
        errorToast(`Pedido ${orderId} Cancelado!`);
        update();
      })
      .catch((e) => errorToast(e.message))
      .finally(() => setLoading(false));
  };

  function translateStatus(status: string) {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "PAID":
        return "Pago";
      default:
        return "Cancelado";
    }
  }

  return (
    <tr key={order.id}>
      <td>{order.id}</td>
      <td>{order.commandId}</td>
      <td>{order.value.toFixed(2)}</td>
      <td>{translateStatus(order.status)}</td>
      <td>{formatDate(order.orderedAt)}</td>
      <td>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          {order.status === "PENDING" && (
            <Button
              disabled={isLoading}
              variant="success"
              onClick={() => handleConfirm(order.id)}
            >
              Confirmar
            </Button>
          )}
          {order.status !== "CANCELLED" && (
            <Button
              disabled={isLoading}
              variant="danger"
              onClick={() => handleCancel(order.id)}
            >
              Cancelar
            </Button>
          )}
          {order.status === "CANCELLED" && <p>Cancelado</p>}
        </div>
      </td>
    </tr>
  );
}
