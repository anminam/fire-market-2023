import { ProductWithCount } from '@/pages';
import { Product } from '@prisma/client';

const getDummyProductMain = (id: number): ProductWithCount => {
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
  return Array.from({ length: 10 }, (_, i) => getDummyProductMain(i));
};

export const getDummyProduct = () => {
  const data = {
    result: true,
    product: {
      id: 24,
      createdAt: '2023-10-11T00:28:41.955Z',
      updatedAt: '2023-10-11T00:28:41.955Z',
      userId: 5,
      image: 'f2b6be2a-567b-4f77-6401-789823177700',
      name: '미니 피씨 팔아요',
      price: 600000,
      place: '서초빌딩 1층',
      description: '팝니다 팔아요',
      user: {
        id: 5,
        name: '가상계정',
        avatar: '6751da8b-8b41-47b6-589f-13d2e14b9600',
      },
    },
    isLike: false,
    relatedProducts: [],
  };

  return data;
};
