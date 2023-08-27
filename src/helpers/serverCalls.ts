import { Product } from "../interfaces";

export const getCommands = async () => {
  const response = await fetch("http://localhost:3001/commands");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getCommandsById = async (id: string) => {
  const response = await fetch("http://localhost:3001/commands/" + id);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const createOrder = async (id: string, value: string) => {
  const response = await fetch(`http://localhost:3001/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify that you're sending JSON data
    },
    body: JSON.stringify({
      commandId: id,
      value: Number(value),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const updateCommandValue = async (id: string, value: number) => {
  const response = await fetch(
    `http://localhost:3001/commands/${id}?value=${value}`,
    {
      method: "Put",
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getProductList = async () => {
  const response = await fetch(`http://localhost:3001/products`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

interface productDebit {
  productid: number;
  quantity: number;
}

export const debitProductsFromCommand = async (
  commandId: string,
  products: productDebit[]
) => {
  const response = await fetch(
    `http://localhost:3001/commands/debit/${commandId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Specify that you're sending JSON data
      },
      body: JSON.stringify(products),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const updateProduct = async (id: number, product: Partial<Product>) => {
  const response = await fetch(`http://localhost:3001/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Specify that you're sending JSON data
    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const createProduct = async (product: Partial<Product>) => {
  const response = await fetch(`http://localhost:3001/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify that you're sending JSON data
    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteProduct = async (id: number) => {
  const response = await fetch(`http://localhost:3001/products/${id}`, {
    method: "Delete",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
