import { ProductStatus } from '@/interface/ProductKind';
import { cls, communityDateFormat, moneyFormat } from '@/libs/client/utils';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiSolidChat } from 'react-icons/bi';

interface ItemProps {
  title: string;
  id: number;
  price: number;
  comments: number;
  hearts?: number;
  imgSrc: string;
  status: ProductStatus;
  date?: Date | string;
}

const ProductImage = ({ title, imgSrc, status }: { imgSrc: string; title: string; status: ProductStatus }) => {
  return (
    <div className={`relative w-20 h-20 bg-gray-400 rounded-md overflow-hidden ${cls(imgSrc ? '' : 'animate-pulse')}`}>
      {status === ProductStatus.RSRV && (
        <div className="absolute flex flex-col top-0 left-0 w-full items-center bg-black bg-opacity-60 animate-bounce">
          <div className="text-sm">{'예약중'}</div>
        </div>
      )}

      {status === ProductStatus.CNCL && (
        <div className="absolute flex flex-col top-0 left-0 w-full items-center bg-black bg-opacity-60 animate-bounce">
          <div className="text-sm">{'등록취소'}</div>
        </div>
      )}

      {status === ProductStatus.HIDE && (
        <div className="absolute flex flex-col top-0 left-0 w-full items-center bg-black bg-opacity-60">
          <div className="text-sm">{'등록대기'}</div>
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

export default function ProductItem({ title, price, comments, hearts, imgSrc, id, status, date }: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="relative flex cursor-pointer justify-between py-4">
        <div className="flex space-x-4">
          {/* 이미지 */}
          <div className="basis-20">
            <ProductImage title={title} imgSrc={imgSrc} status={status} />
          </div>
          {/* 우측 문구들 */}
          {title ? (
            <div className="pt-2 flex flex-col">
              {/* 상품이름 */}
              <h3 className="text-sm font-bold line-clamp-1">{title}</h3>
              {/* 등록일 */}
              {date ? <span className="text-xs mt-1 opacity-50">{communityDateFormat(date)}</span> : null}
              {/* 상품가격 */}
              {price ? <span className="font-medium mt-1">{moneyFormat(price)}원</span> : null}
            </div>
          ) : (
            // 스켈레톤
            <div className="pt-2 flex flex-col">
              {/* 상품이름 */}
              <h3 className="bg-neutral rounded animate-pulse w-40 h-4" />
              {/* 등록일 */}
              <div className="bg-neutral rounded animate-pulse w-20 h-2 mt-3" />
              {/* 상품가격 */}
              <div className="bg-neutral rounded animate-pulse w-32 h-4 mt-3" />
            </div>
          )}
        </div>
        {/* 하단 작은 아이콘 */}
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
