import type { NextPage } from 'next';
import Layout from '@/components/layout';
import Message from '@/components/message';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Chat } from '@prisma/client';

import { AiOutlineSend } from 'react-icons/ai';
import useChat from '@/hooks/useChat';
import react from 'react';
import useFirebaseUser from '@/hooks/useFirebaseUser';

interface ChatDetailResult {
  result: boolean;
  data: Chat;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { init, sendMessage, messages } = useChat();

  const { token } = useFirebaseUser();

  react.useEffect(() => {
    if (!token) return;
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

  const getRoomName = (data: Chat) => {
    const { productId, sellingUserId, buyingUserId } = data;
    return `${productId}-${sellingUserId}-${buyingUserId}`; // '상품id - 판매자id - 구매자id',
    // return `${1}-${14}-${15}`; // '상품id - 판매자id - 구매자id',
  };

  return (
    <Layout canGoBack title="채팅">
      <div className="py-10 pb-16 px-4 space-y-4">
        {messages.map(_ => (
          <Message key={_.id} message={_.text} time={_.date.format} />
        ))}

        <ChatDetailBottomContainer onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

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
