import Layout from '@/components/layout';
import { useRouter } from 'next/router';
import { Product, User } from '@prisma/client';
import Link from 'next/link';
import useMutation from '@/libs/client/useMutation';
import { cls, dateFormat, makeChatRoomId, moneyFormat } from '@/libs/client/utils';
import useSWR from 'swr';
import UserProfileContainer from '@/components/UserProfileContainer';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import useUser from '@/libs/client/useUser';
import ProductMoreModal from '@/components/ProductMoreModal';
import { ProductStatus } from '@/interface/ProductKind';
import { ProductWithUser } from '@/interface/Product';
import ChatPersonSelect from '@/components/ChatPersonSelect';
import { IChatRoom } from '@/interface/Chat';

interface ProductResponse {
  result: boolean;
  data: ProductWithUser;
  isLike: boolean;
  relatedProducts: Product[];
}

interface IStatus {
  value: ProductStatus;
  label: string;
}

interface StateResponse {
  result: boolean;
  data: ProductWithUser;
}

interface IChatRoomResponse {
  result: boolean;
  data: IChatRoom[];
}

const statusList: IStatus[] = [
  { value: 'SALE', label: '판매중' },
  { value: 'RSRV', label: '예약중' },
  { value: 'CMPL', label: '판매완료' },
  { value: 'HIDE', label: '등록취소' },
];

const ItemDetail = () => {
  const router = useRouter();
  const user = useUser();
  const [productState, setProductState] = useState<ProductStatus>('SALE');
  const [isReservationUsersOpen, setIsReservationUsersOpen] = useState(false);
  const [isCompleteUsersOpen, setIsCompleteUsersOpen] = useState(false);

  // api - 상품정보 가져오기.
  const {
    data,
    mutate: boundMutate,
    isLoading,
  } = useSWR<ProductResponse>(router.query.id ? `/api/products/${router.query.id}` : null);

  // api - 상품의 채팅정보 가져오기.
  const { data: chatPersonData } = useSWR<IChatRoomResponse>(
    router.query.id ? `/api/products/${router.query.id}/chat/users` : null,
  );

  // api - 하트 토글.
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/favorite`);

  // api - 상태 변경.
  const [setStateToServer, { data: stateData }] = useMutation<StateResponse>(`/api/products/${router.query.id}/status`);

  // effect - 최초 로딩시.
  useEffect(() => {
    if (data) {
      setProductState(data.data.statusCd);
    }
  }, [data]);

  // handle - 하트 클릭.
  const handleFavClick = () => {
    if (!data) return;
    boundMutate((prev: any) => prev && { ...prev, isLike: !prev.isLike }, false);
    toggleFav({});
  };

  // handle - 채팅하기 클릭.
  const handleChatClick = () => {
    const id = makeChatRoomId({
      productId: data?.data?.id as number,
      sellerId: data?.data?.userId as number,
      buyerId: user.user?.id as number,
    });

    router.push(`/chats/${id}`);
  };

  // handle - 상태 변경 클릭.
  const handleStateClick = (status: ProductStatus) => {
    if (status === 'RSRV') {
      setIsReservationUsersOpen(true);
      return;
    } else if (status === 'CMPL') {
      setIsCompleteUsersOpen(true);
      return;
    }

    start();

    function start() {
      // 서버 상태 변경.
      setStateToServer({ status }, 'PATCH');
      // UI 상태 변경.
      setProductState(status);
      // 모달 감추기.
      hideModal();
    }
  };

  const handleStatusUserSelected = (id: number, status: ProductStatus) => {
    // 서버 상태 변경.
    setStateToServer({ status, buyerId: id }, 'PATCH');
    // UI 상태 변경.
    setProductState(status);
    // 모달 감추기.
    setIsReservationUsersOpen(false);
    setIsCompleteUsersOpen(false);
    // 모달 감추기.
    hideModal();
  };

  // 모달 감추기
  const hideModal = () => {
    const el = document.activeElement as HTMLElement;
    if (el) {
      el?.blur();
    }
  };

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleMoreClick = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  if (router.isFallback) {
    return <div>로딩중...</div>;
  }

  return (
    <Layout title="상품" canGoBack isProducts isMore onMoreClick={handleMoreClick}>
      {/* style={`background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.7));`} */}
      <div className="mb-32">
        {/* 이미지 */}
        <div className={cls('relative pb-80 h-96 bg-neutral', data?.data?.image ? '' : 'animate-pulse')}>
          {data?.data?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={data?.data?.name + ' 이미지'}
              className="absolute inset-0 w-full h-full object-cover"
              src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${data?.data?.image}/public`}
            />
          )}
          {/* 그림자 */}
          <div className="absolute top-0 w-full h-12 bg-gradient-to-b opacity-40 from-black to-white-500" />
        </div>

        {/* 이미지 외. */}
        <div className="mx-4">
          {/* 프로필 */}
          <div>
            <UserProfileContainer
              id={data?.data?.user?.id.toString() || ''}
              avatar={data?.data?.user?.avatar}
              name={data?.data?.user?.name}
              size={12}
              isViewTextProfile
            />
          </div>

          <div className="divider" />

          {/* 상태 */}
          {isMe(data?.data?.user, user.user) && (
            <div>
              <div className="dropdown dropdown-bottom">
                <label tabIndex={0} className="btn btn-base-300 m-1">
                  {statusList.find((_) => _.value === productState)?.label}
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-32">
                  {statusList.map((_) => {
                    if (_.value === productState) return null;
                    return (
                      <li key={_.value}>
                        <button className="" onClick={() => handleStateClick(_.value)}>
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
          {data?.data ? (
            <div className="mt-5">
              {/* 타이틀 */}
              <h1 className="text-xl font-bold">{data.data.name}</h1>
              {/* 시간 */}
              <div className="text-xs opacity-50">{data.data && dateFormat(data.data.createdAt)}</div>
              {/* 가격 */}
              <div className="block mt-3 underline">{data.data && moneyFormat(data.data.price)}원</div>

              {/* 설명 */}
              <p className="my-6">{data.data.description}</p>
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

          {/* 거래희망장소 */}
          {data?.data ? (
            <div>
              <div className="divider" />
              <div className="mt-5">
                <h1 className="text-xl font-bold">거래희망장소</h1>
                <p className="mt-3">{data.data.place}</p>
              </div>
            </div>
          ) : null}

          {data?.relatedProducts?.length ? (
            <div className="mb-10">
              <div className="divider" />
              <h1 className="text-xl font-bold">비슷한 물건</h1>
              <div className="flex mt-3 overflow-x-auto space-x-3">
                {data?.relatedProducts?.map((_) => {
                  return (
                    <Link href={`/products/${_.id}`} key={_.id} className="w-30">
                      <div className="w-16 h-16 rounded-full bg-slate-500 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={_.name + ' 이미지'}
                          src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${_.image}/avatar`}
                        />
                      </div>
                      <h3 className="text-sm opacity-50 line-clamp-1">{_.name}</h3>
                      <span className="">{moneyFormat(_.price)} 원</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 메인 메뉴 모달 */}
      <ProductMoreModal
        ref={dialogRef}
        productId={router.query.id as string}
        userId={user.user?.id as number}
        productUserId={data?.data?.user?.id as number}
      />

      {/* 상태변경 모달(예약) */}
      {chatPersonData && chatPersonData.data && (
        <ChatPersonSelect
          title={'예약자 선택'}
          list={chatPersonData?.data.map((_) => {
            return _.buyer;
          })}
          onSelected={(id) => handleStatusUserSelected(id, 'RSRV')}
          isOpen={isReservationUsersOpen}
          onClose={() => setIsReservationUsersOpen(false)}
        />
      )}

      {/* 상태변경 모달(판매완료) */}
      {chatPersonData && chatPersonData.data && (
        <ChatPersonSelect
          title={'구매자 선택'}
          list={chatPersonData?.data.map((_) => {
            return _.buyer;
          })}
          onSelected={(id) => handleStatusUserSelected(id, 'CMPL')}
          isOpen={isCompleteUsersOpen}
          onClose={() => setIsCompleteUsersOpen(false)}
        />
      )}

      {/* 하단 고정 컨테이너 만들기 */}
      {/* 하단 */}
      <div className="relative overflow-hidden">
        <div className="fixed bottom-0 max-w-xl w-full p-3 border-t-[1px] border-[hsl(var(--bc)/20%)] z-10 bg-base-100">
          {/* 하단 버튼부 */}
          <div className="flex items-center justify-between space-x-2">
            {/* 하트버튼 */}
            <button
              onClick={handleFavClick}
              className={cls(
                'p-3 rounded-md flex items-center justify-center',
                data?.isLike
                  ? 'text-red-400 hover:bg-red-100 hover:text-red-500'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500',
              )}
            >
              {data?.isLike ? <AiFillHeart size="24" /> : <AiOutlineHeart size="24" />}
            </button>
            {/* 채팅버튼 */}
            {isLoading ? null : (
              <button
                className={cls(`btn btn-primary flex-1`, !isMe(data?.data?.user, user.user) ? '' : 'btn-disabled')}
                onClick={handleChatClick}
              >
                채팅하기
              </button>
            )}
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
