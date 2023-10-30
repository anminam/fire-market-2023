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
import useSWR from 'swr';

interface PostEditForm {
  question: string;
}

interface EditPostResponse {
  result: boolean;
  data: Post;
}
interface ReadPostResponse {
  result: boolean;
  data: Post;
}

const EditPost: NextPage = () => {
  const { lat, lng } = useCoords();
  const router = useRouter();
  // form.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostEditForm>();
  // api - 초기 불러오기용.
  const { data: readData, mutate } = useSWR<ReadPostResponse>(router.query.id ? `/api/posts/${router.query.id}` : null);
  // api - 수정.
  const [startEdit, { loading, data }] = useMutation<EditPostResponse>(`/api/posts/${router.query.id}/edit`);

  const onValid = (data: PostEditForm) => {
    if (loading) return;
    startEdit({ ...data, lat, lng, id: router.query.id }, 'PATCH');
  };

  // 초기 데이터 불러오기 셋팅.
  useEffect(() => {
    if (!readData) return;
    setValue('question', readData.data.question || '');
  }, [readData, setValue]);

  // 등록 성공시 이동.
  useEffect(() => {
    if (!data?.result || !data.data.id) return;
    router.replace(`/community/${data.data.id}`);
  }, [data, router]);

  const isLoading = loading || data?.result;

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
            minLength: { value: 2, message: '2글자 이상 입력해 주세요.' },
          })}
        />
        <FormErrorMessage message={errors?.question?.message || ''} />
        <button className={cls(`btn btn-primary w-full`, isLoading ? 'btn-disabled' : '')} type="submit">
          {isLoading ? '업로드중...' : '글 올리기'}
        </button>
      </form>
    </Layout>
  );
};

export default EditPost;
