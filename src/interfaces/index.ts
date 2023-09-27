export interface CommandProduct {
  productId: number;
  orderedAt: string;
  quantity: string;
  productName: string;
}

export interface Command {
  id: string;
  value: number;
  products?: CommandProduct[];
}

export interface Product {
  id: number;
  name: string;
  photo: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: { id: number; name: string };
}

interface Order {
  id: number;
  commandId: number;
  value: number;
  orderedAt: string;
  status: string;
}

export interface ProductOrder {
  id: number;
  commandId: number;
  orderedAt: string;
  sellerId: number;
  value: number;
  status: "OK" | "Cancelled";
  products: { orderId: number; productId: number; quantity: number }[];
}

export interface CommandData {
  id: number;
  name: string;
  value: number;
  orders: Order[];
  productOrders: ProductOrder[];
}
