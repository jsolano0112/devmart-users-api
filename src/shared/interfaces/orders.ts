import { OrderStatus } from './order-status';

export interface IOrderResponse {
  id: number;
  userId: any;
  products: IProduct[];
  paymentMethod: number;
  total: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
}

export interface IUserOrderResponse {
  id: number;
  userId: any;
  count: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
}

export interface IOrder {
  id: number;
  userId: any;
  products: IProduct[];
  paymentMethod: number;
  address: string;
  status: OrderStatus;
}

export interface IUpdateOrder {
  products: IProduct[];
  paymentMethod: number;
  address: string;
  status: OrderStatus;
}

export interface IProduct {
  sku: string;
  count: number;
}
