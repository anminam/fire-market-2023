import { ProductWithCount } from '@/pages';

const getDummyProduct = (id: number): ProductWithCount => {
  return {
    _count: {
      Favorite: 0,
    },
    id,
    name: '',
    description: '',
    price: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 0,
    image: '',
    place: '',
  };
};

export const getDummyProducts = (): ProductWithCount[] => {
  return Array.from({ length: 10 }, (_, i) => getDummyProduct(i));
};
