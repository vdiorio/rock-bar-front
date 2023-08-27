/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import {
  debitProductsFromCommand,
  getProductList,
} from "../../helpers/serverCalls";
import { errorToast, successToast } from "../../helpers/toasts";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function SellerPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [productQuantity, setProductsQuantity] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [commandId, setCommandId] = useState("");

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleCancel = () => {
    setShowModal(false);
    clearQtd();
  };

  const clearQtd = () => {
    const newArr = [...productQuantity].map((qtd) => {
      if (qtd) {
        return 0;
      } else {
        return qtd;
      }
    });
    setProductsQuantity(newArr);
  };

  const generateProductOrder = async () => {
    const prod = products!
      .map(({ id }) => {
        const quantity = productQuantity[id];
        if (quantity > 0) {
          return {
            productId: id,
            quantity,
          };
        }
      })
      .filter((p) => !!p) as any;
    debitProductsFromCommand(commandId, prod)
      .then(() => {
        successToast("Pedido criado!");
        clearQtd();
        setShowModal(false);
      })
      .catch((err) => errorToast(err.message));
  };

  const handleChangeQuantity = (id: number, value: number) => {
    const newArr = [...productQuantity];
    if (!newArr[id]) newArr[id] = 0;
    newArr[id] += value;
    if (newArr[id] < 0) newArr[id] = 0;
    setProductsQuantity(newArr);
  };

  useEffect(() => {
    getProductList()
      .then((productList) => {
        setProducts(productList);
        productList.forEach(({ id }: { id: number }) => {});
      })
      .catch((error) => errorToast(error.message));
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Produtos:</h5>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product) => {
                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              onClick={() =>
                                handleChangeQuantity(product.id, -1)
                              }
                            >
                              -
                            </Button>
                            <p style={{ fontSize: 20 }}>
                              {productQuantity[product.id] || "0"}
                            </p>
                            <Button
                              onClick={() =>
                                handleChangeQuantity(product.id, 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={toggleModal}
                disabled={!productQuantity.some((e) => e > 0)}
              >
                Gerar Pedido
              </Button>
              <Button onClick={clearQtd}>Limpar tabela</Button>
            </div>
            <Modal show={showModal} onHide={toggleModal}>
              <Modal.Header closeButton>
                <Modal.Title>Gerar pedidos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover variant="light">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Preço</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  {products && (
                    <>
                      <tbody>
                        {products.map(({ id, name, price }, index) => {
                          const quantity = productQuantity[id];
                          if (quantity > 0) {
                            return (
                              <tr>
                                <td>{name}</td>
                                <td>{quantity}</td>
                                <td>R$ {price.toFixed(2)}</td>
                                <td>R$ {(price * quantity).toFixed(2)}</td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td style={{ fontWeight: "bold" }}>
                            {"R$ "}
                            {products
                              .reduce((acc, curr) => {
                                if (productQuantity[curr.id] > 0) {
                                  return (
                                    acc + curr.price * productQuantity[curr.id]
                                  );
                                }
                                return acc;
                              }, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </>
                  )}
                </Table>
                <p>Comanda: </p>
                <input
                  type="text"
                  onChange={(e) => setCommandId(e.target.value)}
                  value={commandId}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  disabled={!commandId.length}
                  variant="primary"
                  onClick={generateProductOrder}
                >
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>
            <h6 className="mt-3">Retiradas:</h6>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Comanda</th>
                  <th>Produto</th>
                  <th>QTD</th>
                  <th>Cancelar</th>
                </tr>
              </thead>
              <tbody></tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
