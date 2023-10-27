import Layout from '@/components/layout';
import { useRouter } from 'next/router';
import { Product, User } from '@prisma/client';
import Link from 'next/link';
import useMutation from '@/libs/client/useMutation';
import { cls, dateFormat, moneyFormat } from '@/libs/client/utils';
import Image from 'next/image';
import useSWR from 'swr';
import UserProfileContainer from '@/components/UserProfileContainer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import useUser from '@/libs/client/useUser';
import MoreModal from '@/components/MoreModal';
import { ProductStatus } from '@/interface/ProductKind';
import useChat from '@/hooks/useChat';

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResult {
  result: boolean;
  product: ProductWithUser;
  isLike: boolean;
  relatedProducts: Product[];
}

interface IProductStatusResult {
  result: boolean;
  data: any;
}

interface IStatus {
  value: ProductStatus;
  label: string;
}

const statusList: IStatus[] = [
  { value: 'SALE', label: '판매중' },
  { value: 'RSRV', label: '예약중' },
  { value: 'CMPL', label: '판매완료' },
  { value: 'HIDE', label: '등록취소' },
];

const ItemDetail = () => {
  const { makeChatRoomId } = useChat();
  const router = useRouter();
  const user = useUser();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResult>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/favorite`);
  const [setChat, { loading: chatLoading, data: chatData }] = useMutation(
    `/api/chats/${router.query.id}}`
  );

  // 상태 수정.
  const [setStateToServer] = useMutation(
    `/api/products/${router.query.id}/status`
  );
  const [stateName, setStateName] = useState<string>('판매중');

  const onFavClick = () => {
    if (!data) return;
    boundMutate(
      (prev: any) => prev && { ...prev, isLike: !prev.isLike },
      false
    );
    toggleFav({});
  };

  // 채팅하기 클릭.
  const handleChatClick = () => {
    if (chatLoading) return;

    const id = makeChatRoomId({
      productId: data?.product?.id as number,
      sellerId: data?.product?.userId as number,
      buyerId: user.user?.id as number,
    });

    router.push(`/chats/${id}`);
  };

  // 상태 변경 클릭.
  const handleStateClick = (status: ProductStatus) => {
    setStateToServer({ status }, 'PATCH');
    updateStateName(status);
    setStateName(statusList.find(_ => _.value === status)?.label || '');
    // 감추기
    const el = document.activeElement as HTMLElement;
    if (el) {
      el?.blur();
    }
  };

  const updateStateName = (status: any) => {
    setStateName(statusList.find(_ => _.value === status)?.label || '');
  };

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleMoreClick = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  useEffect(() => {
    if (chatData) {
      router.push(`/chats/${chatData.data.id}`);
    }
  }, [router, chatData]);

  useEffect(() => {
    if (data?.product?.statusCd) {
      updateStateName(data.product.statusCd);
    }
  }, [data?.product?.statusCd]);

  if (router.isFallback) {
    return <div>로딩중...</div>;
  }

  return (
    <Layout
      title="상품"
      canGoBack
      isTranslate
      isMore
      onMoreClick={handleMoreClick}
    >
      <div className="mb-32">
        {/* 이미지 */}
        <div
          className={cls(
            'relative pb-80 h-96 bg-neutral',
            data?.product?.image ? '' : 'animate-pulse'
          )}
        >
          {data?.product?.image && (
            <img
              alt={data?.product?.name + ' 이미지'}
              className="absolute inset-0 w-full h-full object-cover"
              src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${data?.product?.image}/public`}
            />
          )}
        </div>

        {/* 이미지 외. */}
        <div className="mx-4">
          {/* 프로필 */}
          <div>
            <UserProfileContainer
              id={data?.product?.user?.id.toString() || ''}
              avatar={data?.product?.user?.avatar}
              name={data?.product?.user?.name}
              size={12}
              isViewTextProfile
            />
          </div>

          <div className="divider" />

          {/* 상태 */}
          {isMe(data?.product?.user, user.user) && (
            <div>
              <div className="dropdown dropdown-bottom">
                <label tabIndex={0} className="btn btn-neutral m-1">
                  {stateName}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box w-32"
                >
                  {statusList.map(_ => {
                    if (_.value === data?.product?.statusCd) return null;
                    return (
                      <li key={_.value}>
                        <button onClick={() => handleStateClick(_.value)}>
                          {_.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="divider" />
            </div>
          )}

          {/* 상품정보 */}
          {data?.product ? (
            <div className="mt-5">
              {/* 타이틀 */}
              <h1 className="text-xl font-bold">{data.product.name}</h1>
              {/* 시간 */}
              <div className="text-xs opacity-50">
                {data.product && dateFormat(data.product.createdAt)}
              </div>
              {/* 가격 */}
              <div className="block mt-3 underline">
                {data.product && moneyFormat(data.product.price)}원
              </div>

              {/* 설명 */}
              <p className="my-6">{data.product.description}</p>
            </div>
          ) : (
            <div className="mt-5">
              {/* 타이틀 */}
              <h1 className="bg-neutral rounded animate-pulse w-40 h-8" />
              {/* 가격 */}
              <div className="bg-neutral rounded animate-pulse w-40 h-5 mt-3" />
              {/* 시간 */}
              <div className="bg-neutral rounded animate-pulse w-40 h-5 mt-3" />
              {/* 설명 */}
              <p className="bg-neutral rounded animate-pulse w-40 h-10 my-6" />
            </div>
          )}

          {data?.relatedProducts?.length ? (
            <div className="mb-10">
              <div className="divider" />
              <h1 className="text-xl font-bold">비슷한 물건</h1>
              <div className=" mt-6 grid grid-cols-2 gap-4">
                {data?.relatedProducts?.map((_: any, i: any) => {
                  return (
                    <Link href={`/products/${_.id}`} key={_.id}>
                      <div className="w-16 h-16 rounded-full bg-slate-500 relative overflow-hidden">
                        <Image
                          alt={''}
                          src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${_.image}/public`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={true}
                        />
                      </div>
                      <h3 className="text-sm opacity-50">{_.name}</h3>
                      <span className="">1,260,000 원</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 모달 */}
      <MoreModal
        ref={dialogRef}
        productId={router.query.id as string}
        userId={user.user?.id as number}
        productUserId={data?.product?.user?.id as number}
      />

      {/* 하단 고정 컨테이너 만들기 */}
      {/* 하단 */}
      <div className="relative overflow-hidden">
        <div className="fixed bottom-0 max-w-xl w-full p-3 border-t-[1px] border-neutral-700 z-10 bg-base-100">
          {/* 하단 버튼부 */}
          <div className="flex items-center justify-between space-x-2">
            {/* 하트버튼 */}
            <button
              onClick={onFavClick}
              className={cls(
                'p-3 rounded-md flex items-center justify-center',
                data?.isLike
                  ? 'text-red-400 hover:bg-red-100 hover:text-red-500'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'
              )}
            >
              {data?.isLike ? (
                <AiFillHeart size="24" />
              ) : (
                <AiOutlineHeart size="24" />
              )}
            </button>
            {/* 채팅버튼 */}
            <button
              className={cls(
                `btn btn-primary flex-1`,
                !isMe(data?.product?.user, user.user) ? '' : 'btn-disabled'
              )}
              onClick={handleChatClick}
            >
              채팅하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function isMe(you?: User, me?: User) {
  return you?.id === me?.id;
}

export default ItemDetail;
