import type { NextPage } from 'next';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import PostAnswer from '@/components/PostAnswer';
import useMutation from '@/libs/client/useMutation';
import { cls } from '@/libs/client/utils';
import { useEffect, useRef } from 'react';
import UserProfileContainer from '@/components/UserProfileContainer';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import PostMoreModal from '@/components/PostMoreModal';
import useUser from '@/libs/client/useUser';
import { AnswerWithUser, PostWithUser } from '@/interface/Community';

interface PostsResponse {
  result: boolean;
  data: PostWithUser;
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
  const { user } = useUser();
  // form.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerForm>();

  const onValid = (data: AnswerForm) => {
    if (loading) return;

    sendAnswer(data);
  };

  // ref - modal
  const dialogRef = useRef<HTMLDialogElement>(null);

  // api - 초기 불러오기.
  const { data, mutate, isLoading } = useSWR<PostsResponse>(router.query.id ? `/api/posts/${router.query.id}` : null);

  // api - 관심 등록.
  const [wonder, { loading: wonderLoading }] = useMutation(`/api/posts/${router.query.id}/interest`);

  // api - 답변 등록.
  const [sendAnswer, { data: answerData, loading }] = useMutation<AnswerResponse>(
    `/api/posts/${router.query.id}/answers`,
  );

  // handle - 관심 등록.
  const handleInterestClick = () => {
    if (!data) return;
    mutate<PostsResponse>(
      {
        ...data,
        data: {
          ...data?.data,
          _count: {
            ...data?.data._count,
            Interests: data.isWondering ? data?.data._count?.Interests - 1 : data?.data._count?.Interests + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false,
    );

    if (!wonderLoading) {
      wonder({});
    }
  };

  // handle - 더보기 클릭.
  const handleMoreClick = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  useEffect(() => {
    if (answerData) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);

  return (
    <Layout canGoBack title="화재생활" isMore onMoreClick={handleMoreClick}>
      <div className="pt-4 pb-10">
        {/* 프로필 */}
        <div className="px-4">
          <div className="space-x-1">
            <div className="badge badge-sm badge-neutral">질문</div>
            {data?.data?.statusCd === 'HIDE' && <div className="badge badge-sm badge-neutral">숨김</div>}
          </div>
          <UserProfileContainer
            id={data?.data?.user?.id.toString() || ''}
            avatar={data?.data?.user?.avatar}
            name={data?.data?.user?.name}
            size={10}
            isCommunity
            date={data?.data?.createdAt}
          />
        </div>

        <div className="divider" />

        {/* 내용 */}
        <div className="px-4">
          <div>
            <div className="font-bold">{data?.data?.question}</div>
          </div>
          <div className="flex space-x-5 mt-4 w-full">
            <button
              onClick={handleInterestClick}
              className={cls(`flex space-x-2 items-center text-sm`, data?.isWondering ? 'text-blue-500' : 'opacity-50')}
            >
              <AiOutlineCheckCircle size="20" />
              <span>관심 {data?.data?._count.Interests}</span>
            </button>
          </div>
        </div>

        <div className="divider" />

        {/* 댓글 리스트 */}
        <div className="px-4">
          <div className="text-sm">댓글 {data?.data?._count.Answers}</div>
          <div className="my-5 space-y-5">
            {data?.data?.Answers.map(({ id, answer, createdAt, user: { name, avatar } }) => {
              return (
                <PostAnswer
                  key={id}
                  name={name}
                  content={answer}
                  avatar={avatar || ''}
                  createdAt={createdAt.toString()}
                />
              );
            })}
          </div>
        </div>

        {/* 답변 작성  */}
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register('answer', {
              required: true,
              minLength: { value: 2, message: '2글자 이상 입력해주세요.' },
            })}
            name="description"
            placeholder="질문을 남겨주세요!"
            required
          />
          <div className="text-red-400">
            <span>{errors?.answer ? String(errors.answer.message) : ''}</span>
          </div>

          {/* 버튼 */}
          {isLoading ? null : (
            <button className="btn btn-primary mt-2 w-full text-white py-2 px-4">
              {loading ? '답변 등록 중...' : '답변 등록'}
            </button>
          )}
        </form>
      </div>

      {/* 더보기 */}
      <PostMoreModal
        ref={dialogRef}
        postId={+(router.query.id as string)}
        postUserId={data?.data?.userId as number}
        userId={user?.id as number}
        statusCd={data?.data?.statusCd}
      />
    </Layout>
  );
};

export default CommunityPostDetail;
