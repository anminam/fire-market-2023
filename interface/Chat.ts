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

export interface IChatSendMessage {
  roomNm: string;
  text: string;
}
export interface IChatReceivedServerMessage {
  createdAt: string;
  id: number;
  roomNm: string;
  text: string;
  userId: number;
}

export interface IChatMessage {
  id: number; // message Id
  roomNm: string; // room name
  text: string;
  userId: number;
  date: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    format: string;
    isAm: boolean;
  };
}

export interface IChatManager {
  id: number;
  product: Product;
  sellingUser: IUser;
  buyingUser: IUser;
}