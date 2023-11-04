import { Product, User } from '@prisma/client';
import { ProductStatus } from './ProductKind';

export interface IProduct extends Product {
  statusCd: ProductStatus;
}

export interface ProductWithCount extends IProduct {
  _count: {
    Favorite: number;
    chatroom: number;
  };
}

export interface ProductWithUser extends IProduct {
  user: User;
}
