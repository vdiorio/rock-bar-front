import React, { useEffect, useRef, useState } from "react";
import "./productPage.css";
import { Product } from "../../interfaces";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal"; // Importe o componente Modal
import {
  createCategory,
  createProduct,
  getCategories,
  getProductList,
  validateRole,
} from "../../helpers/serverCalls";
import { errorToast, successToast } from "../../helpers/toasts";
import ProductCard from "./components/ProductCard";
import { Button, Form } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<any>(null);
  const dataFetchedRef = useRef(false);
  const [editedName, setEditedName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(0); // Estado para controlar a exibição do modal

  const handleCreateProduct = () => {
    setIsLoading(true);
    createProduct({
      name: editedName,
      price: Number(editedPrice),
      categoryId: Number(categoryId),
    })
      .then(() => {
        successToast("Produto criado!");
        updateProducts();
        handleCloseModal(); // Feche o modal após criar o produto
      })
      .catch(errorToast)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateCategory = () => {
    setIsLoading(true);
    createCategory(categoryName)
      .then(() => {
        successToast("Categoria criada!");
        updateCategories(); // Atualize a lista de categorias após criar a categoria
        handleCloseModal(); // Feche o modal após criar a categoria
      })
      .catch(errorToast)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateCategories = () => {
    getCategories()
      .then((cat) => setCategories(cat))
      .catch(({ message }) => errorToast(message));
  };

  const updateProducts = () => {
    getProductList()
      .then((products) => setProducts(products))
      .catch(({ message }) => errorToast(message));
  };

  const handleCloseModal = () => {
    setShowModal(0);
    setEditedName("");
    setCategoryName("");
    setEditedPrice("");
    setCategoryId(1);
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    validateRole("ADMIN").then(() => {
      updateProducts();
      updateCategories();
    });
  }, []);

  return (
    <div className="container product-container">
      <Card
        className="container"
        style={{ height: "80vh", overflowX: "hidden", overflowY: "scroll" }}
      >
        <ListGroup>
          <ListGroup.Item className="d-flex justify-content-between align-items-start">
            <div
              className="w-100"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="success" onClick={() => setShowModal(1)}>
                Criar produto
              </Button>
              <Button variant="success" onClick={() => setShowModal(2)}>
                Criar categoria
              </Button>
            </div>
          </ListGroup.Item>
          <h3>Produtos cadastrados:</h3>
          {products &&
            products!.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  update={updateProducts}
                  categories={categories}
                />
              );
            })}
        </ListGroup>
      </Card>

      {/* Modal para adicionar produto ou categoria */}
      <Modal show={!!showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {showModal === 1 ? "Criar novo produto" : "Criar nova categoria"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              value={showModal === 1 ? editedName : categoryName}
              onChange={(e) =>
                showModal === 1
                  ? setEditedName(e.target.value)
                  : setCategoryName(e.target.value)
              }
              disabled={isLoading}
              placeholder={
                showModal === 1 ? "Nome do produto" : "Nome da categoria"
              }
            />
          </Form.Group>
          {showModal === 1 && (
            <>
              <Form.Group className="mb-2">
                <CurrencyMaskedInput
                  className="form-control"
                  value={editedPrice}
                  onChange={(e, value) => setEditedPrice(value)}
                  disabled={isLoading}
                  placeholder="Preço"
                />
              </Form.Group>
              <Form.Select
                value={categoryId}
                onChange={({ target: { value } }) =>
                  setCategoryId(Number(value))
                }
              >
                {categories &&
                  categories.map(
                    ({ id, name }: { id: number; name: string }) => (
                      <option value={id}>{name}</option>
                    )
                  )}
              </Form.Select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button
            variant="success"
            onClick={
              showModal === 1 ? handleCreateProduct : handleCreateCategory
            }
            disabled={
              isLoading ||
              (showModal === 1 &&
                (editedPrice.length < 1 || editedName.length < 1)) ||
              (showModal !== 1 && categoryName.trim() === "")
            }
          >
            {showModal === 1 ? "Adicionar Produto" : "Adicionar Categoria"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
