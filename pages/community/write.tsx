import type { NextPage } from 'next';
import Button from '@/components/button';
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
}

interface WriteFormResponse {
  result: boolean;
  data: Post;
}

const Write: NextPage = () => {
  const { lat, lng } = useCoords();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteForm>();
  const [post, { loading, data }] =
    useMutation<WriteFormResponse>('/api/posts');

  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, lat, lng });
  };

  useEffect(() => {
    if (data?.result) {
      router.push(`/community/${data.data.id}`);
    }
  }, [data, router]);

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
        <FormErrorMessage message={errors?.question?.message || ''} />
        <Button text={loading ? '서버에 올리고 있습니다....' : '질문하기'} />
      </form>
    </Layout>
  );
};

export default Write;
