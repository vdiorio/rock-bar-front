import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";
import { createPendingOrder } from "../../../helpers/serverCalls";
import { errorToast } from "../../../helpers/toasts";

interface Props {
  show: boolean;
  onHide: () => void;
  commandId: string | null;
  setPixOrder: (orderId: number) => void
}

const PixModal = ({ show, onHide, commandId, setPixOrder }: Props) => {
  const [reloadAmount, setReloadAmount] = useState("");
  const [isLoading, setLoading] = useState(false);

  // Handle the input change
  const handleAmountChange = (_e: any, value: string) => {
    setReloadAmount(value);
  };

  // Handle the confirm button click
  const handleConfirmClick = () => {
    setLoading(true);
    createPendingOrder(Number(commandId), Number(reloadAmount))
      .then((o: any) => {
        setPixOrder(o.id)
        onHide()
      })
      .catch((e) => errorToast(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <Modal show={show} onHide={onHide as () => void}>
      <Modal.Header closeButton>
        <Modal.Title>Recarregando a comanda {commandId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reloadAmount">
            <Form.Label>Quanto deseja recarregar?</Form.Label>
            <br />
            <CurrencyMaskedInput
              placeholder="R$"
              value={reloadAmount}
              onChange={handleAmountChange}
              className={""}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isLoading} variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          disabled={isLoading || Number(reloadAmount) <= 0}
          variant="primary"
          onClick={handleConfirmClick}
        >
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PixModal;
