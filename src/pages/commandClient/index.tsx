import { useEffect, useState } from "react";
import Container from "../../helpers/Container";
import { useParams } from "react-router-dom";
import { getCommandsById } from "../../helpers/serverCalls";
import { errorToast } from "../../helpers/toasts";
import { CommandData } from "../../interfaces";

export default function CommandClient() {
  const { commandId } = useParams();
  const [command, setCommand] = useState<CommandData | null>(null);

  useEffect(() => {
    getCommandsById(commandId!)
      .then((command) => setCommand(command))
      .catch(({ message }) => errorToast(message));
  }, []);

  return <Container isLoading={!!command}></Container>;
}
