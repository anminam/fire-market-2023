import type { NextPage } from 'next';
import Layout from '@/components/layout';
import Message from '@/components/message';
import { useRouter } from 'next/router';

import { AiOutlineSend } from 'react-icons/ai';
import useChat from '@/hooks/useChat';
import react from 'react';
import useFirebaseUser from '@/hooks/useFirebaseUser';
import useUser from '@/libs/client/useUser';
import useRoom from '@/hooks/useRoom';
import ProductImage from '@/components/ProductImage';
import { moneyFormat } from '@/libs/client/utils';
import Link from 'next/link';
import { IRoom } from '@/interface/Chat';

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { init, sendMessage, messages } = useChat();

  const { token } = useFirebaseUser();
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

  react.useEffect(() => {
    // 스크롤 맨아래로 내리기
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    window.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <Layout canGoBack title={'채팅'}>
      {/* 상단에 상품보여주기 */}
      {room && <ChatDetailTopContainer room={room} />}
      {/* 채팅 */}
      <div className="relative">
        <div className="py-16 pb-16 px-4 space-y-4 overflow-auto">
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

const ChatDetailTopContainer = ({ room }: { room: IRoom }) => {
  return (
    <div className="fixed z-10 left-0 w-full">
      <div className="w-full max-w-xl mx-auto bg-base-100">
        <Link href={`/products/${room?.product.id}`}>
          <div className="px-4 py-2 flex border-b-[1px] border-neutral">
            <ProductImage
              size={10}
              alt={`${room?.product.name} 이미지`}
              src={room?.product.image}
            />
            <div className="flex flex-col text-xs justify-center pl-4">
              <span className="overflow-hidden">{room?.product.name}</span>
              <span>
                {room?.product.price && moneyFormat(room?.product.price) + '원'}
              </span>
            </div>
          </div>
        </Link>
      </div>
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
