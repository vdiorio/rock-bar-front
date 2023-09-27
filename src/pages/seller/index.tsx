/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import {
  debitProductsFromCommand,
  getOrdersBySellerId,
  getProductList,
} from "../../helpers/serverCalls";
import { errorToast, successToast } from "../../helpers/toasts";
import ReactLoading from "react-loading";
import "./sellerPage.css";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  comanda: number;
  product: string;
  quantity: number;
  orderedAt: string;
}

export default function SellerPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [productQuantity, setProductsQuantity] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleCancelOrder = (id: number) => {};

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

  const loadData = async () => {
    const loadProducts = getProductList()
      .then((productList) => {
        setProducts(productList);
        productList.forEach(({ id }: { id: number }) => {});
      })
      .catch((error) => errorToast(error.message));
    const loadOrders = getOrdersBySellerId()
      .then((orders) => {
        setOrders(orders);
      })
      .catch((error) => errorToast(error.message));
    await Promise.all([loadProducts, loadOrders]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {isLoading ? (
        <ReactLoading color={"black"} height={"20%"} width={"20%"} />
      ) : (
        <div className="container mt-5 seller-container">
          <h1>Página de vendas</h1>
          <div>
            <h5 className="card-title">Produtos:</h5>
            <div className="table-container">
              <Table striped bordered hover variant="dark" size="sm">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {products &&
                    products.map((product) => {
                      return (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{`R$ ${product.price.toFixed(2)}`}</td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                verticalAlign: "middle",
                                textAlign: "center",
                              }}
                            >
                              <Button
                                onClick={() =>
                                  handleChangeQuantity(product.id, -1)
                                }
                              >
                                \/
                              </Button>
                              <p
                                style={{
                                  fontSize: 20,
                                  verticalAlign: "middle",
                                }}
                              >
                                {productQuantity[product.id] || "0"}
                              </p>
                              <Button
                                onClick={() =>
                                  handleChangeQuantity(product.id, 1)
                                }
                              >
                                /\
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={clearQtd}>
                Limpar tabela
              </Button>
              <Button
                onClick={toggleModal}
                disabled={!productQuantity.some((e) => e > 0)}
                variant="success"
              >
                Gerar Pedido
              </Button>
            </div>
          </div>
          <Modal show={showModal} onHide={toggleModal}>
            <Modal.Header closeButton>
              <Modal.Title>Gerar pedidos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="table-container">
                <Table striped bordered hover variant="dark" size="sm">
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
                          <td style={{ fontWeight: "bold" }}>Total: </td>
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
              </div>
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
          <div>
            <h6 className="mt-3">Retiradas:</h6>
            <div className="table-container">
              <Table striped bordered hover variant="dark" size="sm">
                <thead>
                  <tr>
                    <th>Comanda</th>
                    <th>Produto</th>
                    <th>QTD</th>
                    <th>Cancelar</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.comanda}</td>
                        <td>{order.product}</td>
                        <td>{order.quantity}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancelar
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
