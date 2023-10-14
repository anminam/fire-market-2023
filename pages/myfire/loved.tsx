import type { NextPage } from 'next';
import Item from '@/components/ProductItem';
import Layout from '@/components/layout';
import ProductList from '@/components/ProductList';

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack>
      <ProductList kind="favorites" />
    </Layout>
  );
};

export default Loved;
