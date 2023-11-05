import { Product, User, chatroom } from '@prisma/client';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IChatServerManager {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  sellingUserId: number;
  buyingUserId: number;
  product: IProduct;
  sellingUser: IUser;
  buyingUser: IUser;
}

export interface IChatSendMessage {
  roomNm: string;
  text: string;
}

export interface IChatReceivedRoomInfo {
  messages: IChatReceivedServerMessage[];
  room: IChatReceivedServerRoom;
}
export interface IChatReceivedServerMessage {
  createdAt: string;
  id: number;
  roomNm: string;
  text: string;
  userId: number;
}
export interface IChatReceivedServerRoom {
  roomNm: string;
  productId: number;
  sellerId: number;
  buyerId: number;
  sellerReadId: number;
  buyerReadId: number;
  updatedAt: Date;
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

export interface IRoom {
  roomNm: string;
  productId: number;
  sellerId: number;
  buyerId: number;
  sellerReadId: number;
  buyerReadId: number;
  updatedAt: Date;
  text: string;
  product: IProduct;
  seller: User;
  buyer: User;
  readCount?: number;
}

export interface IChatRoom extends chatroom {
  buyer: User;
}
