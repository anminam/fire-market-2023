import Item from './ProductItem';
import { ProductWithCount } from '@/pages';

interface IProps {
  products: ProductWithCount[];
}
const MainProducts = ({ products }: IProps) => {
  return (
    <div className="flex flex-col space-y-5 divide-y divide-neutral">
      {products.map((item) => (
        <Item
          id={item.id}
          key={item.id}
          title={item.name}
          price={item.price}
          comments={1}
          hearts={item._count?.Favorite || 0}
          imgSrc={item.image}
        />
      ))}
    </div>
  );
};

export default MainProducts;
