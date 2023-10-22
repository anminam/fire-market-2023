import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Product } from '@prisma/client';
import client from '@/libs/server/client';
import { HiPlus } from 'react-icons/hi';
import MainProducts from '@/components/MainProducts';
import { getDummyProducts } from '@/libs/client/mocks/products';

interface ProductsResponse {
  result: boolean;
  products: ProductWithCount[];
}
const dummyProducts = getDummyProducts();
export interface ProductWithCount extends Product {
  _count: {
    Favorite: number;
  };
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>('/api/products');

  return (
    <Layout title="장터보기" isViewTabBar>
      <div className="flex flex-col space-y-5 divide-y divide-neutral">
        <MainProducts products={data ? data.products : dummyProducts} />

        <FloatingButton href="/products/upload">
          <HiPlus className="text-lg" />
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
