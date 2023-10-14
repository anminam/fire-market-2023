import type { NextPage } from 'next';
import Item from '@/components/ProductItem';
import Layout from '@/components/layout';
import ProductList from '@/components/ProductList';

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack>
      <ProductList kind="purchase" />
    </Layout>
  );
};

export default Bought;
