import useSWR from 'swr';
import Item from './ProductItem';
import { ProductWithCount } from '@/pages';
import Nothing from './Nothing';

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
function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full w-full mt-10">
      {children}
    </div>
  );
}
export default function ProductList({ kind }: ProductListProps) {
  const { data, isLoading } = useSWR<ProductListResponse>(
    `/api/users/my/${kind}`
  );

  if (isLoading) {
    return (
      <CenterContainer>
        <div className="loading loading-spinner loading-lg"></div>
      </CenterContainer>
    );
  }
  if (!data || data.data.length === 0) {
    return (
      <CenterContainer>
        <Nothing />
      </CenterContainer>
    );
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
