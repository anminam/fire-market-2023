import useSWR from 'swr';
import Item from './ProductItem';
import { ProductWithCount } from '@/pages';
import Nothing from './Nothing';
import { Product } from '@prisma/client';

interface IProps {
  list: Product[];
}
function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full w-full mt-10">
      {children}
    </div>
  );
}
export default function ProductByList({ list }: IProps) {
  if (!list.length) {
    return (
      <CenterContainer>
        <Nothing />
      </CenterContainer>
    );
  }

  return list.map(_ => {
    return (
      <Item
        id={_.id}
        key={_.id}
        title={_.name}
        price={_.price}
        imgSrc={_.image}
        comments={1}
        // hearts={_.Favorite}
        status={_.statusCd}
      />
    );
  });
}
