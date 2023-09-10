import { Product } from "../interfaces";

const API_URL = "http://localhost:3001";

const fetchWithToken = async (
  url: string,
  method = "GET",
  body: any = null
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getCommands = async () => {
  return await fetchWithToken("/commands");
};

export const getCommandsById = async (id: string) => {
  return await fetchWithToken(`/commands/${id}`);
};

export const createOrder = async (id: string, value: string) => {
  return await fetchWithToken("/orders", "POST", {
    commandId: id,
    value: Number(value),
  });
};

export const updateCommandValue = async (id: string, value: number) => {
  return await fetchWithToken(`/commands/${id}?value=${value}`, "PUT");
};

export const getProductList = async () => {
  let url = "/products";
  if (localStorage.getItem("role") === "SELLER") {
    url += `?sellerid=${localStorage.getItem("id")}`;
  }
  return await fetchWithToken(url);
};

interface productDebit {
  productid: number;
  quantity: number;
}

export const debitProductsFromCommand = async (
  commandId: string,
  products: productDebit[]
) => {
  return await fetchWithToken(`/commands/debit/${commandId}`, "PUT", products);
};

export const updateProduct = async (id: number, product: Partial<Product>) => {
  return await fetchWithToken(`/products/${id}`, "PUT", product);
};

export const createProduct = async (product: Partial<Product>) => {
  return await fetchWithToken("/products", "POST", product);
};

export const deleteProduct = async (id: number) => {
  return await fetchWithToken(`/products/${id}`, "DELETE");
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const { token, role } = await response.json();
  return { token, role };
};

export const validateRole = async (requiredRole: "ADMIN" | "SELLER") => {
  const response = await fetchWithToken("/login/validate-role");
  const { role } = response;
  if (!(role === "ADMIN" || role === requiredRole)) {
    throw new Error("Não autorizado");
  }
  return role;
};

export const validateToken = async () => {
  const response = await fetchWithToken("/login/validate-role");
  return response.role;
};

export const getOrdersBySellerId = async () => {
  return await fetchWithToken("/command-orders");
};

export const getAdminUsers = async () => {
  return await fetchWithToken("/users/seller");
};

export const resetPassword = async (id: string, password: string) => {
  return await fetchWithToken("/users/" + id, "PUT", { password });
};
