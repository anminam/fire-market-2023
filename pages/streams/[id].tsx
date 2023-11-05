import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Stream, User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import useUser from '@/libs/client/useUser';
import { moneyFormat } from '@/libs/client/utils';
import Layout from '@/components/layout';
import Message from '@/components/message';
import UserProfileContainer from '@/components/UserProfileContainer';
import { AiOutlineSend } from 'react-icons/ai';
import { useEffect } from 'react';

interface IStreamMessage {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
    name: string;
  };
}

interface StreamWithMessage extends Stream {
  StreamMessage: IStreamMessage[];
  user: User;
}

interface StreamResponse {
  result: boolean;
  data: StreamWithMessage;
}

interface MessageForm {
  message: string;
}

const scrollDown = () => {
  document.querySelector<HTMLDivElement>('.scroll-container')?.scroll({ top: 999999, behavior: 'smooth' });
};

const StreamPage: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  // const { register, handleSubmit, reset } = useForm<MessageForm>();

  const [sendMessage, { loading, data: sendMessageData }] = useMutation<StreamResponse>(
    `/api/streams/${router.query.id}/messages`,
  );

  const { data, mutate } = useSWR<StreamResponse>(router.query.id ? `/api/streams/${router.query.id}` : null, {
    refreshInterval: 1000,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    e.currentTarget.reset();

    if (!message) return;
    mutate((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          StreamMessage: [
            ...prev.data.StreamMessage,
            {
              id: Date.now(),
              message,
              user: {
                ...user,
              },
            },
          ],
        },
      };
    }, false);

    scrollDown();

    sendMessage({
      message,
    });
  };

  // 데이터 챗 불러오면 스크롤 다운.
  useEffect(() => {
    if (data?.data) {
      scrollDown();
    }
  }, [data]);

  return (
    <Layout canGoBack title="라이브 ">
      <div className="py-10 px-4 space-y-4">
        {/* 비디오 */}
        <div className="w-full rounded-md shadow-sm bg-neutral aspect-video">
          {data?.data.cloudStreamId ? (
            <iframe
              src={`https://customer-rfd4j8o0msz4s9nx.cloudflarestream.com/${data?.data.cloudStreamId}/iframe`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              id="stream-player"
              className="w-full h-full rounded-md shadow-sm bg-neutral"
            ></iframe>
          ) : null}
        </div>
        {/* 프로필 */}
        <UserProfileContainer
          id={data?.data?.user?.id.toString() || ''}
          avatar={data?.data?.user?.avatar}
          name={data?.data?.user?.name}
          size={12}
          isViewTextProfile
        ></UserProfileContainer>
        <div className="divider"></div>
        {/* 설명 */}
        <div className="mt-5">
          {/* 타이틀 */}
          <h1 className="text-3xl font-bold">{data?.data?.name}</h1>
          {/* 가격 */}
          <span className="text-2xl block mt-3">{moneyFormat(Number(data?.data?.price))} 원</span>
          {/* 설명 */}
          <p className="my-6">{data?.data?.description}</p>
          {/* 방송하기 */}
          {data?.data?.cloudStreamKey && (
            <div className="bg-base-300 rounded-xl p-4 overflow-scroll">
              <div className="font-bold">스트리밍 키(주인장)</div>
              <div>
                <ul>
                  <li className="mt-3">
                    <div className="font-bold">URL: </div>
                    <div>{data?.data?.cloudStreamUrl}</div>
                  </li>
                  <li className="mt-3">
                    <div className="font-bold">KEY: </div>
                    <div className="mr-4">{data?.data?.cloudStreamKey}</div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="divider"></div>
        {/* 챗 */}
        <div>
          <h2 className="text-2xl font-bold">라이브 챗</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4 scroll-container">
            {data?.data?.StreamMessage?.map((_) => (
              <Message
                key={_.id}
                message={_.message}
                avatar={_.user.avatar}
                reversed={_.user.id !== user?.id}
                name={_.user.name}
                time={''}
              />
            ))}
          </div>
          {/* <div className="fixed py-2 bottom-0 inset-x-0">
            <form onSubmit={handleSubmit(onValid)} className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                {...register('message', { required: true })}
                type="text"
                className="pl-4 pr-10 py-2 shadow-sm rounded-full w-full border border-gray-300 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 items-center bg-blue-500 rounded-full px-3 hover:bg-blue-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div> */}
        </div>
      </div>
      <ChatDetailBottomContainer onSubmit={handleSubmit} />
    </Layout>
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

export default StreamPage;
