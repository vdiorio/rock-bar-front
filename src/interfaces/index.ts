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
}

interface Order {
  id: number;
  commandId: number;
  value: number;
  orderedAt: string;
  status: string;
}

export interface CommandData {
  id: number;
  value: number;
  orders: Order[];
  products: CommandProduct[];
}
