import { CommandData, Product } from "../interfaces";

const API_URL = "https://eskinarockbarapi.hopto.org";

const fetchWithToken = async (
  url: string,
  method = "GET",
  body: any = null
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.clear();
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
  const response = await fetch(`${API_URL}/commands/${id}`);

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data as CommandData;
};

export const createOrder = async (
  id: string,
  value: string,
  name: string = ""
) => {
  return await fetchWithToken("/orders", "POST", {
    commandId: id,
    value: Number(value),
    name,
  });
};

export const updateCommandData = async (
  id: string,
  value: number,
  name: string = ""
) =>
  await fetchWithToken(
    `/commands/${id}?value=${value}&name=${name.length ? name : null}`,
    "PUT"
  );

export const getProductList = async () => {
  let url = "/products";
  if (localStorage.getItem("role") === "SELLER") {
    url += `?sellerId=${localStorage.getItem("id")}`;
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

export const createCategory = async (name: string) => {
  return await fetchWithToken("/categories", "POST", { name });
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
  const { token, role, id } = await response.json();
  return { token, role, id };
};

export const validateRole = async (requiredRole: "ADMIN" | "SELLER") => {
  const response = await fetchWithToken("/login/validate-role");
  const { role } = response;
  if (!(role === "ADMIN" || role === requiredRole.toUpperCase())) {
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

export const getCategories = async () => {
  return await fetchWithToken("/categories");
};

export const resetPassword = async (id: string, password: string) => {
  return await fetchWithToken("/users/" + id, "PUT", { password });
};

export const changeUserCategory = async (id: string, categoryId: number) => {
  return await fetchWithToken("/users/upcat/" + id, "PUT", { categoryId });
};

export const createSeller = async (userData: any) => {
  return await fetchWithToken("/users", "POST", userData);
};

export const getPendingOrder = async (orderId: number) => {
  const response = await fetch(`${API_URL}/orders/pending/${orderId}`);

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  const data = await response.json();
  return data as {
    commandId: number;
    value: number;
  };
};

export const createPendingOrder = async (commandId: number, value: number) => {
  const body = { commandId, value };
  return fetch(`${API_URL}/orders/pending/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).catch((e) => console.log(e));
};

export const confirmOrder = async (orderId: number) => {
  return fetchWithToken(`/orders/pending/${orderId}`, "PUT");
};

export const cancelOrder = async (orderId: number) => {
  return fetchWithToken(`/orders/${orderId}`, "PUT");
};

export const getOrders = async () => {
  return fetchWithToken("/orders");
};
