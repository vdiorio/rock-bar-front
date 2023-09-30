import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/admin">Estação Eskina Rock Bar</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarText" />
      <Navbar.Collapse id="navbarText">
        <Nav className="mr-auto">
          {isAdmin && (
            <>
              <Nav.Link href="/admin">Comandas</Nav.Link>
              <Nav.Link href="/admin/orders">Pedidos</Nav.Link>
              <Nav.Link href="/admin/products">Produtos</Nav.Link>
              <Nav.Link href="/admin/users">Usuários</Nav.Link>
            </>
          )}
          <Nav.Link onClick={logout} href="/login" style={{ float: "right" }}>
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
