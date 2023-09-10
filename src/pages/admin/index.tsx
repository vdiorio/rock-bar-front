import React, { useEffect, useRef, useState } from "react";
import CommandCard from "./components/CommandCard";
import { Command } from "../../interfaces";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { getCommands, validateRole } from "../../helpers/serverCalls";
import { redirectAndClearStorage } from "../../helpers/redirect";
import { useNavigate } from "react-router-dom";
import Container from "../../helpers/Container";

export default function AdminPage() {
  const [commands, setCommands] = useState<Command[] | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  const setSearchAndPage = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    validateRole("ADMIN")
      .then(() => {
        getCommands()
          .then((commands) => setCommands(commands))
          .catch(() => redirectAndClearStorage(navigate));
      })
      .catch(() => redirectAndClearStorage(navigate))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <Container isLoading={isLoading}>
      <input
        type="text"
        value={search}
        onChange={setSearchAndPage}
        placeholder="Pesquisar Comanda"
        style={{ width: "98%", margin: "1%" }}
      />
      <Card
        className="container"
        style={{ height: "80vh", overflowX: "hidden", overflowY: "scroll" }}
      >
        <ListGroup>
          {commands &&
            commands!
              .filter((c) => String(c.id).startsWith(search))
              .map((command) => {
                return <CommandCard command={command} />;
              })}
        </ListGroup>
      </Card>
    </Container>
  );
}
