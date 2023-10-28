import type { NextPage } from 'next';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { Answer, Post, User } from '@prisma/client';
import PostAnswer from '@/components/PostAnswer';
import useMutation from '@/libs/client/useMutation';
import { cls } from '@/libs/client/utils';
import { useEffect, useRef } from 'react';
import UserProfileContainer from '@/components/UserProfileContainer';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import PostMoreModal from '@/components/PostMoreModal';
import useUser from '@/libs/client/useUser';

interface AnswerWithUser extends Answer {
  user: User;
}
interface PostWithUser extends Post {
  user: User;
  _count: {
    Answers: number;
    Interests: number;
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerForm>();

  const { user } = useUser();

  const { data, mutate } = useSWR<PostsResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );

  if (data) {
  }

  const [wonder, { loading: wonderLoading }] = useMutation(
    `/api/posts/${router.query.id}/interest`
  );

  const [sendAnswer, { data: answerData, loading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`);

  const onWonderClick = () => {
    if (!data) return;

    mutate(
      {
        ...data,
        post: {
          ...data?.post,
          _count: {
            ...data?.post._count,
            Interests: data.isWondering
              ? data?.post._count?.Interests - 1
              : data?.post._count?.Interests + 1,
          },
        },
        isWondering: !data.isWondering,
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
    if (answerData) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);

  // 모달
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleMoreClick = () => {
    debugger;
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  /* 모달 */
  <PostMoreModal
    ref={dialogRef}
    postId={+(router.query.id as string)}
    postUserId={data?.post?.userId as number}
    userId={user?.id as number}
  />;

  return (
    <Layout canGoBack title="화재생활" isMore onMoreClick={handleMoreClick}>
      <div className="mt-4">
        {/* 프로필 */}
        <div className="px-4">
          <div className="badge badge-sm badge-neutral">질문</div>
          <UserProfileContainer
            id={data?.post?.user?.id.toString() || ''}
            avatar={data?.post?.user?.avatar}
            name={data?.post?.user?.name}
            size={10}
            isCommunity
            date={data?.post?.createdAt}
          />
        </div>

        <div className="divider" />

        {/* 내용 */}
        <div className="px-4">
          <div>
            <div className="font-bold">{data?.post?.question}</div>
          </div>
          <div className="flex space-x-5 mt-4 w-full">
            <button
              onClick={onWonderClick}
              className={cls(
                `flex space-x-2 items-center text-sm`,
                data?.isWondering ? 'text-blue-500' : 'opacity-50'
              )}
            >
              <AiOutlineCheckCircle size="20" />
              <span>관심 {data?.post?._count.Interests}</span>
            </button>
          </div>
        </div>

        <div className="divider" />

        {/* 답변 */}
        <div className="px-4">
          <div>댓글 {data?.post?._count.Answers}</div>
          <div className="my-5 space-y-5">
            {data?.post?.Answers.map(
              ({ id, answer, createdAt, user: { name, avatar } }) => {
                return (
                  <PostAnswer
                    key={id}
                    name={name}
                    content={answer}
                    avatar={avatar || ''}
                    createdAt={createdAt.toString()}
                  />
                );
              }
            )}
          </div>
        </div>

        {/* 답변 작성  */}
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
          <div className="text-red-400">
            <span>{errors?.answer ? String(errors.answer.message) : ''}</span>
          </div>

          <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none ">
            {loading ? '답변 등록 중...' : '답변 등록'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
