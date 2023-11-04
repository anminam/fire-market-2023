import useSWR from 'swr';
import Item from './ProductItem';
import { ProductWithCount } from '@/interface/Product';
import NothingWithContainer from './NothingWithContainer';
import LoadingWithContainer from './LoadingWithContainer';

interface ProductListProps {
  kind: 'sales' | 'favorites' | 'purchase' | 'sales-all';
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data, isLoading } = useSWR<ProductListResponse>(`/api/users/my/${kind}`);

  if (isLoading) {
    return <LoadingWithContainer />;
  }
  if (!data || data.data.length === 0) {
    return <NothingWithContainer />;
  }

  return (
    <div className="flex flex-col px-4 divide-y divide-neutral">
      {data.data.map((_) => (
        <Item
          id={_.product.id}
          key={_.product.id}
          title={_.product.name}
          price={_.product.price}
          imgSrc={_.product.image}
          comments={1}
          hearts={_.product._count.Favorite}
          status={_.product.statusCd}
        />
      ))}
    </div>
  );
}
