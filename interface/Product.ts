import { Product } from '@prisma/client';
import { ProductStatus } from './ProductKind';

export interface ProductWithCount extends Product {
  statusCd: ProductStatus;
  _count: {
    Favorite: number;
  };
}
