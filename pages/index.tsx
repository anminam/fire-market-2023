import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Item from '@/components/ProductItem';
import Layout from '@/components/layout';

import useUser from '@/libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Product } from '@prisma/client';
import Image from 'next/image';
import 쿠로미 from '@/public/쿠로미.png';
import client from '@/libs/server/client';
import { AiOutlinePlus } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

interface ProductsResponse {
  result: boolean;
  products: ProductWithCount[];
}

export interface ProductWithCount extends Product {
  _count: {
    Favorite: number;
  };
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductsResponse>('/api/products');

  return (
    <Layout title="장터보기" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y divide-neutral">
        {data
          ? data?.products.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                title={product.name}
                price={product.price}
                comments={1}
                hearts={product._count?.Favorite || 0}
                imgSrc={product.image}
              />
            ))
          : 'loading'}

        <FloatingButton href="/products/upload">
          <HiPlus className="text-lg" />
        </FloatingButton>
      </div>
    </Layout>
  );
};

const PageContainer: NextPage<{ products: ProductWithCount[] }> = ({
  products,
}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/products': {
            result: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};
export async function getServerSideProps() {
  const products = await client?.product.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default PageContainer;
