import { Product } from '@prisma/client';

export interface ProductWithCount extends Product {
  _count: {
    Favorite: number;
  };
}
