import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactLoading from "react-loading";
import { QrCodePix } from "qrcode-pix";
import { getPendingOrder } from "../../../helpers/serverCalls";
import { successToast } from "../../../helpers/toasts";

interface Props {
  orderId: number;
  onHide: () => void;
}

const PixInfoModal = ({ orderId, onHide }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [pix, setPix] = useState<{ payload: string; img: string }>({
    payload: "",
    img: "",
  });

  useEffect(() => {
    getPendingOrder(orderId)
      .then((order) => {
        getPixInfo(order!.commandId, order!.value).then((r) => {
          setPix(r);
          setLoading(false);
        });
      })
      .catch(() => {
        successToast("Pagamento confirmado");
        onHide();
      });
  }, []);

  const getPixInfo = async (commandId: number, value: number) => {
    const p = QrCodePix({
      version: "01",
      key: "+5511971233100", //or any PIX key
      name: "Vitor Diorio",
      city: "SERRA AZUL",
      transactionId: String(orderId), //max 25 characters
      message: `Recarga comanda ${commandId}`,
      cep: "14230000",
      value,
    });
    const img = await p.base64();
    const payload = p.payload();
    return { img, payload };
  };

  function copyToClipBoard(text: string) {
    navigator.clipboard.writeText(text);
    successToast("Copiado para o clipboard!");
  }

  return (
    <Modal show={!!orderId} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Pague agora mesmo no app do seu banco!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <ReactLoading color={"black"} height={"20%"} width={"20%"} />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h1 style={{ color: "black" }}>Qr Code:</h1>
            <img src={pix.img} alt="Qr code" />
            <h1 style={{ color: "black" }}>Pix Copia e cola:</h1>
            <input
              type="text"
              readOnly
              value={pix.payload}
              style={{ width: "80%", display: "inline-block" }}
              onClick={() => copyToClipBoard(pix.payload)}
            />
            <button
              style={{ display: "inline-block" }}
              onClick={() => copyToClipBoard(pix.payload)}
            >
              Copiar
            </button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <p>
          Seu pedido será liberado em breve após o pagamento. Se você estiver
          experimentando atrasos significativos, por favor, não hesite em
          solicitar assistência no caixa.
        </p>
        <Button variant="primary" onClick={onHide}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PixInfoModal;
