import type { NextPage } from 'next';
import Layout from '@/components/layout';
import MainProducts from '@/components/MainProducts';
import useSWR from 'swr';
import Nothing from '@/components/Nothing';
import { ProductWithCount } from '@/interface/Product';

interface ProductsResponse {
  result: boolean;
  products: ProductWithCount[];
}

function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full w-full mt-10">
      {children}
    </div>
  );
}

const SaleAll: NextPage = () => {
  const { data, isLoading } = useSWR<ProductsResponse>(
    '/api/users/my/sales-all'
  );
  if (isLoading) {
    return (
      <CenterContainer>
        <div className="loading loading-spinner loading-lg"></div>
      </CenterContainer>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <CenterContainer>
        <Nothing />
      </CenterContainer>
    );
  }
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 divide-y divide-neutral">
        <MainProducts products={data.products} />
      </div>
    </Layout>
  );
};

export default SaleAll;
