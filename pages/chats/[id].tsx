import type { NextPage } from 'next';
import Layout from '@/components/layout';
import Message from '@/components/message';
import { useRouter } from 'next/router';

import { AiOutlineSend } from 'react-icons/ai';
import useChat from '@/hooks/useChat';
import react, { useEffect, useRef } from 'react';

import useUser from '@/libs/client/useUser';
import useRoom from '@/hooks/useRoom';
import ProductImage from '@/components/ProductImage';
import { moneyFormat } from '@/libs/client/utils';
import Link from 'next/link';
import { IRoom } from '@/interface/Chat';
import { User } from '@prisma/client';
import ModalSellProductState from '@/components/ModalSellProductState';
import { useMiniStore } from '@/hooks/useStore';

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { init, sendMessage, messages } = useChat();
  const readChat = useMiniStore(_ => _.readChat);
  const roomsCount = useMiniStore(_ => _.roomsCount);

  useEffect(() => {
    if (router.query.id) {
      if (roomsCount > 0) {
        readChat(router.query.id as string);
      }
    }
  }, [router.query.id, readChat, roomsCount]);

  const token = useMiniStore(_ => _.token);
  const { setToken, room } = useRoom(router.query.id as string);

  react.useEffect(() => {
    if (!token) return;
    setToken(token);
    init({ token, roomName: router.query.id as string });
  }, [token]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    e.currentTarget.reset();

    if (!message) return;
    // if (!data) return;

    sendMessage(message);
  };

  useEffect(() => {
    document
      .querySelector<HTMLDivElement>('.scroll-container')
      ?.scroll({ top: 999999, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // 요소의 크기가 변경될 때 실행될 함수
    function handleResize() {
      const scrollContainer =
        document.querySelector<HTMLDivElement>('.scroll-container');
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

  return (
    <Layout canGoBack title={'채팅'}>
      {/* 상단에 상품보여주기 */}
      {room && user && <ChatDetailTopContainer room={room} user={user} />}
      {/* 채팅 */}
      <div className="relative flex pt-14 overflow-hidden chat-container ">
        <div className="px-4 space-y-4 overflow-auto scroll-container w-full">
          {messages.map(_ => {
            const tUser =
              room?.sellerId === _?.userId ? room?.seller : room?.buyer;
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
  room,
  user,
}: {
  room: IRoom;
  user: User;
}) => {
  const router = useRouter();

  // 거래 변경클릭
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const dialogRef = useRef<HTMLDialogElement>(null);

  const isMe = user.id === room.sellerId;

  return (
    <div className="fixed z-10 left-0 w-full">
      <div className="w-full max-w-xl mx-auto bg-base-100">
        <Link href={`/products/${room?.product.id}`}>
          <div className="flex justify-between border-b-[1px] border-neutral items-center px-4">
            <div className="py-2 flex">
              <ProductImage
                size={10}
                alt={`${room?.product.name} 이미지`}
                src={room?.product.image}
              />
              <div className="flex flex-col text-xs justify-center pl-4">
                <span className="overflow-hidden">{room?.product.name}</span>
                <span>
                  {room?.product.price &&
                    moneyFormat(room?.product.price) + '원'}
                </span>
              </div>
            </div>
            {isMe && (
              <div className="">
                <button className="btn btn-sm" onClick={handleClick}>
                  거래변경
                </button>
              </div>
            )}
          </div>
        </Link>
      </div>
      {/* 모달 */}
      <ModalSellProductState
        ref={dialogRef}
        productId={room.productId}
        buyerId={room.buyerId}
        productUserId={room.sellerId}
      />
    </div>
  );
};

/** 하단 */
const ChatDetailBottomContainer = ({
  onSubmit,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) => {
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
