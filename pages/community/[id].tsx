import type { NextPage } from 'next';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { Answer, Post, User } from '@prisma/client';
import Link from 'next/link';
import PostAnswer from '@/components/PostAnswer';
import useMutation from '@/libs/client/useMutation';
import { cls } from '@/libs/client/utils';
import { useEffect } from 'react';

interface AnswerWithUser extends Answer {
  user: User;
}
interface PostWithUser extends Post {
  user: User;
  _count: {
    Answers: number;
    Wonderings: number;
  };
  Answers: AnswerWithUser[];
}

interface PostsResponse {
  result: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}
interface AnswerResponse {
  result: boolean;
  answer: AnswerWithUser;
}
const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const { data: wonderData, mutate } = useSWR<PostsResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );

  const [wonder, { loading: wonderLoading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );

  const [sendAnswer, { data, loading }] = useMutation<AnswerResponse>(
    `/api/posts/${router.query.id}/answers`
  );

  const onWonderClick = () => {
    if (!wonderData) return;

    mutate(
      {
        ...wonderData,
        post: {
          ...wonderData?.post,
          _count: {
            ...wonderData?.post._count,
            Wonderings: wonderData.isWondering
              ? wonderData?.post._count?.Wonderings - 1
              : wonderData?.post._count?.Wonderings + 1,
          },
        },
        isWondering: !wonderData.isWondering,
      },
      false
    );
    if (!wonderLoading) {
      wonder({});
    }
  };

  const onValid = (data: AnswerForm) => {
    if (loading) return;

    sendAnswer(data);
  };

  useEffect(() => {
    if (data) {
      reset();
      mutate();
    }
  }, [data, reset, mutate]);

  return (
    <Layout canGoBack>
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          질문
        </span>
        <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {wonderData?.post?.user?.name}
            </p>
            <Link href={`/users/profiles/${wonderData?.post?.user?.id}`}>
              <p className="text-xs font-medium text-gray-500">사랑합니다</p>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-blue-500 font-medium">Q. </span>
            {/* 질문 */}
            <span>{wonderData?.post?.question}</span>
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <button
              onClick={onWonderClick}
              className={cls(
                `flex space-x-2 items-center text-sm`,
                wonderData?.isWondering ? 'text-blue-500' : ''
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {wonderData?.post?._count.Wonderings}</span>
            </button>
            <span className="flex space-x-2 items-center text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {wonderData?.post?._count.Answers}</span>
            </span>
          </div>
        </div>
        <div className="px-4 my-5 space-y-5">
          {wonderData?.post?.Answers.map(
            ({ id, answer, createdAt, user: { name } }) => {
              return (
                <PostAnswer
                  key={id}
                  name={name}
                  content={answer}
                  createdAt={createdAt.toString()}
                />
              );
            }
          )}
        </div>
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register('answer', {
              required: true,
              minLength: { value: 5, message: '5글자 이상 입력해주세요.' },
            })}
            name="description"
            placeholder="질문을 남겨주세요!"
            required
          />
          <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none ">
            {loading ? '답변 등록 중...' : '답변 등록'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
