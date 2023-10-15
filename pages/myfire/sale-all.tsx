import type { NextPage } from 'next';
import Layout from '@/components/layout';
import MainProducts from '@/components/MainProducts';
import { Product } from '@prisma/client';
import useSWR from 'swr';

interface ProductsResponse {
  result: boolean;
  products: ProductWithCount[];
}

export interface ProductWithCount extends Product {
  _count: {
    Favorite: number;
  };
}
const SaleAll: NextPage = () => {
  const { data } = useSWR<ProductsResponse>('/api/users/my/sales-all');
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 divide-y divide-neutral">
        {data ? <MainProducts products={data.products} /> : 'loading'}
      </div>
    </Layout>
  );
};

export default SaleAll;
