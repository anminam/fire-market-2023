import Item from './ProductItem';
import { Product } from '@prisma/client';
import NothingWithContainer from './NothingWithContainer';

interface IProps {
  list: Product[];
}

export default function ProductByList({ list }: IProps) {
  if (!list.length) {
    return <NothingWithContainer />;
  }

  return (
    <div>
      {list.map((_) => {
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
      })}
    </div>
  );
}
