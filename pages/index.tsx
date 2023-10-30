import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import useSWR from 'swr';
import { HiPlus } from 'react-icons/hi';
import MainProducts from '@/components/MainProducts';
import { getDummyProducts } from '@/libs/client/mocks/products';
import { useRouter } from 'next/router';
import { ProductWithCount } from '@/interface/Product';

interface ProductsResponse {
  result: boolean;
  data: ProductWithCount[];
  error: any;
}
const dummyProducts = getDummyProducts();

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>('/api/products');
  const router = useRouter();

  const products = data?.data || dummyProducts;
  // const products = dummyProducts;

  if (data?.error?.code === 'P2022') {
    router.push('/error?message=점검중입니다.&code=P2022');
  }

  return (
    <Layout title="장터보기" isViewTabBar>
      <div className="flex flex-col">
        <MainProducts products={products} />

        <FloatingButton href="/products/upload">
          <HiPlus className="text-lg" />
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
