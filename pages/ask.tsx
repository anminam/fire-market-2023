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

interface AskEditForm {
  text: string;
}

interface AskResponse {
  result: boolean;
  data: Post;
}

const AskToAnminam: NextPage = () => {
  const { lat, lng } = useCoords();
  const router = useRouter();
  // form.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AskEditForm>();

  // api - 수정.
  const [startAsk, { loading, data }] = useMutation<AskResponse>(`/api/ask/`);

  const onValid = (data: AskEditForm) => {
    if (loading) return;
    startAsk({ ...data });
  };

  // 등록 성공시 이동.
  useEffect(() => {
    if (!data?.result || !data.data.id) return;
    alert('문의가 완료됐습니다.');
    router.replace(`/`);
  }, [data, router]);

  const isLoading = loading || data?.result;

  return (
    <Layout canGoBack title="화재생활">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          placeholder={cls('문의사항을 적어주세요.')}
          register={register('text', {
            required: {
              value: true,
              message: '문의사항을 적어주세요.',
            },
            minLength: { value: 2, message: '2글자 이상 입력해 주세요.' },
          })}
        />
        <FormErrorMessage message={errors?.text?.message || ''} />
        <button className={cls(`btn btn-primary w-full`, isLoading ? 'btn-disabled' : '')} type="submit">
          {isLoading ? '업로드중...' : '문의하기'}
        </button>
      </form>
    </Layout>
  );
};

export default AskToAnminam;
