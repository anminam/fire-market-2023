import type { NextPage } from 'next';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Post } from '@prisma/client';
import useCoords from '@/libs/client/usecoords';
import { cls } from '@/libs/client/utils';
import FormErrorMessage from '@/components/FormErrorMessage';

interface WriteForm {
  question: string;
  checkbox_is_anonymous: boolean;
}

interface WriteFormResponse {
  result: boolean;
  data: Post;
}

const Write: NextPage = () => {
  const { lat, lng } = useCoords();
  const router = useRouter();

  // form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<WriteForm>();

  // API - 일반글 게시용.
  const [post, { loading, data }] = useMutation<WriteFormResponse>('/api/posts');

  // API - 익명글 게시용.
  const [anonymousPost, { loading: anonymousLoading, data: anonymousData }] =
    useMutation<WriteFormResponse>('/api/posts/anonymous');

  const isLoading = loading || anonymousLoading;

  const onValid = (data: WriteForm) => {
    if (isLoading) return;

    // 익명으로 남기기 체크일 경우.
    if (getValues('checkbox_is_anonymous')) {
      anonymousPost({ ...data });
      // 일반글일 경우.
    } else {
      post({ ...data, lat, lng });
    }
  };

  useEffect(() => {
    if (data?.result) {
      alert('글이 등록되었습니다.');
      router.replace(`/community/${data.data.id}`);
    }

    if (anonymousData?.result) {
      alert('익명글이 등록되었습니다.');
      router.replace(`/community/${anonymousData.data.id}`);
    }
  }, [data, router, anonymousData]);

  return (
    <Layout canGoBack title="화재생활 ">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          placeholder={cls('질문을 적어주세요.')}
          register={register('question', {
            required: {
              value: true,
              message: '질문을 적어주세요.',
            },
            minLength: { value: 5, message: '5글자 이상 입력해 주세요.' },
          })}
        />
        {/* 익명 체크 */}
        <div>
          <label className="text-sm flex items-center">
            <input
              {...register('checkbox_is_anonymous', {
                onChange: (e) => {
                  if (e.target.checked) {
                    alert('익명으로 남기기를 체크하면 사용자를 알 수 없어, 삭제할 수 없습니다.');
                  }
                },
              })}
              type="checkbox"
              className="checkbox"
            />
            <span className="ml-2">익명으로 남기기</span>
          </label>
        </div>

        <FormErrorMessage message={errors?.question?.message || ''} />
        <button className={cls(`btn btn-primary w-full`, isLoading ? 'btn-disabled' : '')} type="submit">
          {isLoading ? '업로드중...' : '글 올리기'}
        </button>
      </form>
    </Layout>
  );
};

export default Write;
