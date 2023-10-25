import { ProductStatus } from '@/interface/ProductKind';
import { cls, moneyFormat } from '@/libs/client/utils';
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
  status: ProductStatus;
}

const ProductImage = ({
  title,
  imgSrc,
  status,
}: {
  imgSrc: string;
  title: string;
  status: ProductStatus;
}) => {
  return (
    <div
      className={`relative w-20 h-20 bg-gray-400 rounded-md overflow-hidden ${cls(
        imgSrc ? '' : 'animate-pulse'
      )}`}
    >
      {status === ProductStatus.RSRV && (
        <div className="absolute flex flex-col top-0 left-0 w-full items-center bg-black bg-opacity-50">
          <div className="text-sm">{'예약중'}</div>
        </div>
      )}

      {status === ProductStatus.CNCL && (
        <div className="absolute flex flex-col top-0 left-0 w-full items-center bg-black bg-opacity-50">
          <div className="text-sm">{'등록취소'}</div>
        </div>
      )}

      {imgSrc && (
        <img
          alt={`${title} 이미지`}
          src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${imgSrc}/public`}
          className=" bg-slate-300 object-cover w-full h-full"
        />
      )}
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
  status,
}: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="relative flex px-4 pt-5 cursor-pointer justify-between">
        <div className="flex space-x-4">
          <ProductImage title={title} imgSrc={imgSrc} status={status} />
          <div className="pt-2 flex flex-col">
            <h3 className="text-sm font-bold">{title}</h3>
            {price ? (
              <span className="font-medium mt-1">{moneyFormat(price)}원</span>
            ) : null}
          </div>
        </div>
        <div className="flex space-x-2 items-end justify-end text-sm opacity-50">
          {hearts ? (
            <div className="flex items-center space-x-1">
              <AiOutlineHeart />
              <span>{hearts}</span>
            </div>
          ) : null}
          {comments ? (
            <div className="flex items-center space-x-1">
              <BiSolidChat />
              <span>{comments}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
