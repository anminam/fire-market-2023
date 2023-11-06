import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import useSWR from 'swr';
import { HiPlus } from 'react-icons/hi';
import MainProducts from '@/components/MainProducts';
import { getDummyProducts } from '@/libs/client/mocks/products';
import { useRouter } from 'next/router';
import { ProductWithCount } from '@/interface/Product';
import { useInfiniteScroll } from '@/hooks/useInfinityScroll';
import useSWRInfinite from 'swr/infinite';
import { useMemo, useRef, useState } from 'react';

interface ProductsResponse {
  result: boolean;
  data: ProductWithCount[];
  error: any;
}
const dummyProducts = getDummyProducts();

const Home: NextPage = () => {
  // const { data } = useSWR<ProductsResponse>('/api/products');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const [isScrollStop, setIsScrollStop] = useState(false);

  // api - 상품.
  const { data, setSize, size } = useSWRInfinite<ProductsResponse>((index) => `/api/products?page=${index}&take=${20}`);

  const newData = useMemo(() => {
    setLoading(false);
    if (data) {
      const arr: ProductWithCount[] = [];

      if (data[data.length - 1].data.length === 0) {
        setIsScrollStop(true);
      }

      const newData = arr.concat(...data.map((el) => el.data));
      return newData;
    }
    return [];
  }, [data]);

  const products = newData || dummyProducts;

  // if (data?.error?.code === 'P2022') {
  //   router.push('/error?message=점검중입니다.&code=P2022');
  // }

  const { lastDataRendered } = useInfiniteScroll(setLoading, setSize, observer, { size, loading }, false);

  return (
    <Layout title="장터보기" isViewTabBar>
      <div className="flex flex-col">
        <MainProducts products={products} />
        {isScrollStop ? (
          <div className="flex justify-center">
            <div className="py-5">모든 상품을 불러왔습니다.</div>
          </div>
        ) : (
          <div ref={lastDataRendered}>
            <div className="flex justify-center">
              <div className="py-5">상품을 불러오고 있습니다.</div>
            </div>
          </div>
        )}

        <FloatingButton href="/products/upload">
          <HiPlus className="text-lg" />
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
