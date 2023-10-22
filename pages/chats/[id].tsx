import type { NextPage } from 'next';
import Layout from '@/components/layout';
import Message from '@/components/message';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Chat } from '@prisma/client';

import { AiOutlineSend } from 'react-icons/ai';
import useChat from '@/hooks/useChat';
import { useEffect } from 'react';
import useFirebaseAuth from '@/hooks/useFirebaseCurrentUsre';

interface ChatDetailResult {
  result: boolean;
  data: Chat;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate, isLoading } = useSWR<ChatDetailResult>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );
  const { setToken } = useChat();
  const { token } = useFirebaseAuth();

  useEffect(() => {
    if (!token) return;
    setToken(token);
  }, [setToken, token]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    console.log(message);
    // TODO: Send message to server
    e.currentTarget.reset();
  };

  const loadRoom = (data: any) => {
    debugger;
  };

  if (data) {
  }
  return (
    <Layout canGoBack title="채팅">
      <div className="py-10 pb-16 px-4 space-y-4">
        <Message message="Hi how much are you selling them for?" />
        <Message message="I want ￦20,000" reversed />
        <Message message="미쳤어" />
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
    <form
      onSubmit={onSubmit}
      className="fixed bottom-0 w-full max-w-xl mx-auto"
    >
      <div className=" bg-base-100 left-0 p-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="w-full input input-sm bg-base-200"
            placeholder="메시지 보내기..."
          />
          <button className="btn bg-base-100 border-base-100">
            <AiOutlineSend />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatDetail;
