import React, { useEffect, useRef, useState } from "react";
import { Product } from "../../interfaces";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  createProduct,
  getProductList,
  validateRole,
} from "../../helpers/serverCalls";
import { errorToast, successToast } from "../../helpers/toasts";
import ProductCard from "./components/ProductCard";
import { Button, Form } from "react-bootstrap";
import CurrencyMaskedInput from "react-currency-masked-input";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const dataFetchedRef = useRef(false);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProduct = () => {
    setIsLoading(true);
    createProduct({ name: editedName, price: Number(editedPrice) })
      .then(() => {
        successToast("Produto criado!");
        updateProducts();
      })
      .catch(errorToast)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateProducts = () => {
    getProductList()
      .then((products) => setProducts(products))
      .catch(({ message }) => errorToast(message));
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    validateRole("ADMIN").then(updateProducts);
  }, []);

  return (
    <div className="container">
      <Card
        className="container"
        style={{ height: "80vh", overflowX: "hidden", overflowY: "scroll" }}
      >
        <ListGroup>
          <ListGroup.Item className="d-flex justify-content-between align-items-start">
            <div className="w-100">
              <h3>Criar novo produto</h3>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Nome do produto"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <CurrencyMaskedInput
                  className="form-control"
                  value={editedPrice}
                  onChange={(e, value) => setEditedPrice(value)}
                  disabled={isLoading}
                  placeholder="Preço"
                />
              </Form.Group>
              <Button
                disabled={
                  isLoading || editedPrice.length < 1 || editedName.length < 1
                }
                variant="success"
                onClick={handleCreateProduct}
              >
                Adicionar Produto
              </Button>
            </div>
          </ListGroup.Item>
          <h3>Produtos cadastrados:</h3>
          {products &&
            products!.map((product) => {
              return <ProductCard product={product} update={updateProducts} />;
            })}
        </ListGroup>
      </Card>
    </div>
  );
}
