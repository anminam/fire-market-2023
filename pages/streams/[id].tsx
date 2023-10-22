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
const StreamPage: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { register, handleSubmit, reset } = useForm<MessageForm>();

  const [sendMessage, { loading, data: sendMessageData }] =
    useMutation<StreamResponse>(`/api/streams/${router.query.id}/messages`);

  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );

  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          StreamMessage: [
            ...prev.data.StreamMessage,
            {
              id: Date.now(),
              message: form.message,
              user: {
                ...user,
              },
            },
          ],
        },
      };
    }, false);

    sendMessage(form);
  };

  return (
    <Layout canGoBack title="라이브 ">
      <div className="py-10 px-4 space-y-4">
        {/* 비디오 */}
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video">
          {data?.data.cloudStreamId ? (
            <iframe
              src={`https://customer-rfd4j8o0msz4s9nx.cloudflarestream.com/${data?.data.cloudStreamId}/iframe`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              id="stream-player"
              className="w-full h-full rounded-md shadow-sm bg-slate-300"
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
          <span className="text-2xl block mt-3">
            {moneyFormat(Number(data?.data?.price))} 원
          </span>
          {/* 설명 */}
          <p className="my-6">{data?.data?.description}</p>
          {/* 방송하기 */}
          {data?.data?.cloudStreamKey && (
            <div className="bg-slate-200 rounded-xl p-4 overflow-scroll">
              <div className="font-bold">스트리밍 키(주인장)</div>
              <div>
                <ul>
                  <li className="mt-3">
                    <div className="font-bold">URL: </div>
                    <div>{data?.data?.cloudStreamUrl}</div>
                  </li>
                  <li className="mt-3">
                    <div className="font-bold">KEY: </div>
                    <div>{data?.data?.cloudStreamKey}</div>
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
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.data?.StreamMessage?.map((_) => (
              <Message
                key={_.id}
                message={_.message}
                avatar={_.user.avatar}
                reversed={_.user.id === user?.id}
                name={_.user.name}
              />
            ))}
          </div>
          <div className="fixed py-2 bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamPage;
