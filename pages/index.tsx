import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Product } from '@prisma/client';
import client from '@/libs/server/client';
import { HiPlus } from 'react-icons/hi';
import MainProducts from '@/components/MainProducts';

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
    <Layout title="장터보기" isViewTabBar>
      <div className="flex flex-col space-y-5 divide-y divide-neutral">
        {data ? <MainProducts products={data.products} /> : 'loading'}

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
