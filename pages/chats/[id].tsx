import type { NextPage } from 'next';
import Layout from '@/components/layout';
import Message from '@/components/message';
import { useRouter } from 'next/router';

import { AiOutlineSend } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';

import useUser from '@/libs/client/useUser';
import ProductImage from '@/components/ProductImage';
import { moneyFormat } from '@/libs/client/utils';
import Link from 'next/link';
import { IChatMessage, IRoom } from '@/interface/Chat';
import ModalSellProductState from '@/components/ModalSellProductState';
import { useMiniStore } from '@/hooks/useStore';
import useSWR from 'swr';
import { IProduct } from '@/interface/Product';
import StatusBadge from '@/components/StatusBadge';
import { IUser } from '@/interface/User';

interface ProductDataResponse {
  result: boolean;
  data: IProduct;
}

function getProductIdByRoomId(roomId: string): string {
  if (!roomId) return '';
  return roomId.split('-')[0];
}

function getRoom(rooms: IRoom[], roomName: string): IRoom | null {
  for (const room of rooms) {
    if (room.roomNm === roomName) {
      return room;
    }
  }

  return null;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { sendMessage, getMessage, readChat, rooms } = useMiniStore();

  const room = getRoom(rooms, router.query.id as string);

  const [messages, setMessages] = useState<IChatMessage[]>([]);

  // api - 상품 불러오기.
  const productId = getProductIdByRoomId(router?.query?.id as string);
  const { data: productData } = useSWR<ProductDataResponse>(productId ? `/api/products/${productId}` : null);

  // 보내기
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    e.currentTarget.reset();

    if (!message) return;
    // if (!data) return;
    sendMessage(router.query.id as string, message);
  };

  useEffect(() => {
    async function func() {
      if (router.query.id) {
        const messages = await getMessage(router.query.id as string);
        setMessages(messages);
      }
    }

    func();
  }, [getMessage, router.query.id, rooms]);

  useEffect(() => {
    async function func() {
      if (router.query.id) {
        readChat(router.query.id as string);
      }
    }
    func();
  }, [readChat, router.query.id]);

  useEffect(() => {
    document.querySelector<HTMLDivElement>('.scroll-container')?.scroll({ top: 999999, behavior: 'smooth' });
  }, [messages]);

  // 스크롤
  useEffect(() => {
    // 요소의 크기가 변경될 때 실행될 함수
    function handleResize() {
      const scrollContainer = document.querySelector<HTMLDivElement>('.scroll-container');
      if (scrollContainer) {
        let height = document.documentElement.clientHeight;
        height = height - 57 - 48 - 64;
        // console.log(height);
        scrollContainer.style.maxHeight = `${height}px`;
        scrollContainer.style.minHeight = `${height}px`;
      }
    }

    // 초기 실행
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const userYours = user?.id === room?.buyerId ? room?.seller : room?.buyer;
  const userMy = user;

  return (
    <Layout canGoBack title={'채팅'}>
      {/* 상단에 상품보여주기 */}
      {userMy && userYours && productData?.data && (
        <ChatDetailTopContainer product={productData.data} userMy={userMy} userYours={userYours} />
      )}
      {/* 채팅 */}
      <div className="relative flex pt-14 overflow-hidden chat-container ">
        <div className="px-4 space-y-4 overflow-auto scroll-container w-full">
          {messages.map((_) => {
            const tUser = room?.sellerId === _?.userId ? room?.seller : room?.buyer;
            return (
              <Message
                key={_.id}
                message={_.text}
                time={_.date.format}
                reversed={_.userId !== user?.id}
                name={tUser?.name}
                avatar={tUser?.avatar}
              />
            );
          })}
        </div>
      </div>
      <ChatDetailBottomContainer onSubmit={handleSubmit} />
    </Layout>
  );
};

const ChatDetailTopContainer = ({
  userMy,
  userYours,
  product,
}: {
  userMy: IUser;
  userYours: IUser;
  product: IProduct;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const buyerId = userYours?.id;
  const isMyProduct = userMy.id === product.userId;
  const isShowBadge = product.buyerId === buyerId;

  // handle - 거래 변경클릭.
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  return (
    <div className="fixed z-10 left-0 w-full">
      <div className="w-full max-w-xl mx-auto bg-base-100">
        <Link href={`/products/${product.id}`}>
          <div className="flex justify-between border-b-[1px] border-[hsl(var(--bc)/20%)] items-center px-4">
            <div className="py-2 flex items-center">
              <div className={`w-${10}`}>
                <ProductImage size={10} alt={`${product.name} 이미지`} src={product.image} />
              </div>
              <div className="flex flex-col text-xs justify-center px-4">
                <span className="overflow-hidden line-clamp-1">{product.name}</span>
                <span>{product.price && moneyFormat(product.price) + '원'}</span>
              </div>
              {isShowBadge ? (
                <div className="w-20">
                  <StatusBadge status={product.statusCd} />
                </div>
              ) : null}
            </div>
            {isMyProduct && (
              <div className="">
                <button className="btn btn-sm min-w-max" onClick={handleClick}>
                  거래변경
                </button>
              </div>
            )}
          </div>
        </Link>
      </div>
      {/* 모달 */}
      <ModalSellProductState ref={dialogRef} productId={product.id} buyerId={buyerId} productUserId={product.userId} />
    </div>
  );
};

/** 하단 */
const ChatDetailBottomContainer = ({ onSubmit }: { onSubmit: React.FormEventHandler<HTMLFormElement> }) => {
  return (
    <form onSubmit={onSubmit} className="fixed left-0 bottom-0 w-full">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-base-100 left-0 p-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="message"
              className="w-full input bg-base-200"
              placeholder="메시지 보내기..."
              autoComplete="off"
            />
            <button className="btn bg-base-100 border-base-100">
              <AiOutlineSend />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatDetail;
