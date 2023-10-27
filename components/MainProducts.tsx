import { ProductWithCount } from '@/interface/Product';
import Item from './ProductItem';

interface IProps {
  products: ProductWithCount[];
}
const MainProducts = ({ products }: IProps) => {
  return (
    <div className="flex flex-col space-y-5 divide-y divide-neutral">
      {products.map(item => (
        <Item
          id={item.id}
          key={item.id}
          title={item.name}
          price={item.price}
          comments={0}
          hearts={item._count?.Favorite || 0}
          imgSrc={item.image}
          status={item.statusCd}
        />
      ))}
    </div>
  );
};

export default MainProducts;
