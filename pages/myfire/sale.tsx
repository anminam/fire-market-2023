import type { NextPage } from 'next';
import Layout from '@/components/layout';
import ProductList from '@/components/ProductList';

const Sale: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10 divide-y divide-[hsl(var(--bc)/20%)]">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Sale;
