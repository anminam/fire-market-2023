import { Product, User } from '@prisma/client';
import { IUser } from './User';

export interface IChatServerManager {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  sellingUserId: number;
  buyingUserId: number;
  product: Product;
  sellingUser: User;
  buyingUser: User;
}

export interface IChatManager {
  id: number;
  product: Product;
  sellingUser: IUser;
  buyingUser: IUser;
}
