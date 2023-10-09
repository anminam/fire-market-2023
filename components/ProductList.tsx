import { ProductKind } from '@/interface/ProductKind';
import useSWR from 'swr';
import Item from './ProductItem';
import { ProductWithCount } from '@/pages';
import Nothing from './Nothing';

interface ProductListProps {
  kind: 'sales' | 'favorites' | 'purchase';
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/my/${kind}`);

  if (!data || data.data.length === 0) {
    return <Nothing />;
  }

  return data.data.map((_) => {
    return (
      <Item
        id={_.product.id}
        key={_.product.id}
        title={_.product.name}
        price={_.product.price}
        imgSrc={_.product.image}
        comments={1}
        hearts={_.product._count.Favorite}
      />
    );
  });
}
