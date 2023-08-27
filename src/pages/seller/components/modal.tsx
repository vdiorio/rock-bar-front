import { Button, Modal } from "react-bootstrap";

interface Props {
  showModal: boolean | undefined;
  closeModal: () => void;
}

export default function OrderModal({ showModal, closeModal }: Props) {
  const handleGenerateOrder = () => {};
  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Generate Order</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleGenerateOrder}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
