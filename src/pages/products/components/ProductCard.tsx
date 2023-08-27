import { Product } from "../../../interfaces";
import { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";
import { deleteProduct, updateProduct } from "../../../helpers/serverCalls";
import { errorToast, successToast } from "../../../helpers/toasts";

export default function ProductCard({
  product,
  update,
}: {
  product: Product;
  update: () => void;
}) {
  const { id, price, name } = product;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedPrice, setEditedPrice] = useState(String(price.toFixed(2)));

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Tem certeza que quer excluir o produto {${name}}?`
    );
    if (confirmDelete) {
      setIsLoading(true);
      deleteProduct(id)
        .then(() => {
          successToast("Produto excluido!");
          update();
        })
        .catch(({ message }) => errorToast(message))
        .finally(() => {
          setIsEditing(false);
          setIsLoading(false);
        });
    }
  };

  const handleCancelEdit = () => {
    setEditedName(name);
    setEditedPrice(String(price.toFixed(2)));
    setIsEditing(false);
  };

  const handleConfirmEdit = () => {
    setIsLoading(true);
    updateProduct(id, { name: editedName, price: Number(editedPrice) })
      .then(() => {
        successToast("Produto atualizado!");
        update();
      })
      .catch(({ message }) => errorToast(message))
      .finally(() => {
        setIsEditing(false);
        setIsLoading(false);
      });
  };

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-start"
      action
    >
      {isEditing ? (
        <div className="w-100">
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <CurrencyMaskedInput
              className="form-control"
              value={editedPrice}
              onChange={(e, value) => setEditedPrice(value)}
            />
          </Form.Group>
          <Button
            disabled={isLoading}
            variant="success"
            onClick={handleConfirmEdit}
          >
            Salvar
          </Button>
          <Button
            disabled={isLoading}
            variant="danger"
            className="ms-2"
            onClick={handleCancelEdit}
          >
            Cancelar
          </Button>
          <Button
            disabled={isLoading}
            variant="danger"
            className="ms-2"
            onClick={handleDelete}
          >
            Deletar
          </Button>
        </div>
      ) : (
        <div className="d-flex w-100 justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{name}</div>
            {`Preço: R$ ${String(price.toFixed(2))}`}
          </div>
          <Button variant="outline-secondary" onClick={handleEditClick}>
            Editar
          </Button>
        </div>
      )}
    </ListGroup.Item>
  );
}
