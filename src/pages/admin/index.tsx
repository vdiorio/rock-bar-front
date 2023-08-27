import React, { useEffect, useRef, useState } from "react";
import CommandCard from "./components/CommandCard";
import { Command } from "../../interfaces";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { getCommands } from "../../helpers/serverCalls";
import { errorToast } from "../../helpers/toasts";

export default function AdminPage() {
  const [commands, setCommands] = useState<Command[] | null>(null);
  const [search, setSearch] = useState("");
  const dataFetchedRef = useRef(false);

  const setSearchAndPage = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(value);
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getCommands()
      .then((commands) => setCommands(commands))
      .catch(({ message }) => errorToast(message));
  }, []);

  return (
    <div className="container">
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
    </div>
  );
}
