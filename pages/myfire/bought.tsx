import type { NextPage } from 'next';
import Layout from '@/components/layout';
import MainProducts from '@/components/MainProducts';
import { ProductWithCount } from '@/interface/Product';
import useSWR from 'swr';
import LoadingWithContainer from '@/components/LoadingWithContainer';
import NothingWithContainer from '@/components/NothingWithContainer';

interface ProductsResponse {
  result: boolean;
  data: ProductWithCount[];
  error: any;
}

const Bought: NextPage = () => {
  const { data } = useSWR<ProductsResponse>('/api/users/my/products/bought');
  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col">
        {!data && <LoadingWithContainer />}
        {data?.data?.length === 0 ? <NothingWithContainer /> : <MainProducts products={data?.data || []} />}
      </div>
    </Layout>
  );
};

export default Bought;
