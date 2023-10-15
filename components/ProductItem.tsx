import { moneyFormat } from '@/libs/client/utils';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiSolidChat } from 'react-icons/bi';

interface ItemProps {
  title: string;
  id: number;
  price: number;
  comments: number;
  hearts: number;
  imgSrc: string;
}

const ProductImage = ({ title, imgSrc }: { imgSrc: string; title: string }) => {
  return (
    <div className="relative w-20 h-20 bg-gray-400 rounded-md overflow-hidden">
      <img
        alt={`${title} 이미지`}
        src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${imgSrc}/public`}
        className=" bg-slate-300 object-cover w-full h-full"
      />
    </div>
  );
};

export default function ProductItem({
  title,
  price,
  comments,
  hearts,
  imgSrc,
  id,
}: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="flex px-4 pt-5 cursor-pointer justify-between">
        <div className="flex space-x-4">
          <ProductImage title={title} imgSrc={imgSrc} />
          <div className="pt-2 flex flex-col">
            <h3 className="text-sm font-bold">{title}</h3>
            <span className="font-medium mt-1">{moneyFormat(price)}원</span>
          </div>
        </div>
        <div className="flex space-x-2 items-end justify-end text-sm opacity-50">
          <div className="flex items-center space-x-1">
            <AiOutlineHeart />
            <span>{hearts}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BiSolidChat />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
