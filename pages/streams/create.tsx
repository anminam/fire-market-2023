import type { NextPage } from 'next';
import Button from '@/components/button';
import Input from '@/components/input';
import Layout from '@/components/layout';
import TextArea from '@/components/textarea';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stream } from '@prisma/client';
import { cls } from '@/libs/client/utils';

interface LiveForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  result: boolean;
  data: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { loading, data }] = useMutation<CreateResponse>('/api/streams');
  const { register, handleSubmit } = useForm<LiveForm>();

  const onValid = async (form: LiveForm) => {
    if (loading) return;
    createStream(form);
  };

  useEffect(() => {
    if (data && data.result) {
      router.replace(`/streams/${data.data.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="라이브">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input register={register('name', { required: true })} label="이름" name="name" type="text" />
        <Input
          register={register('price', { required: true, valueAsNumber: true })}
          label="금액"
          placeholder="예) 20000"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea register={register('description', { required: true })} name="description" label="설명 " />
        <button className={cls(`btn btn-primary w-full`, loading ? 'btn-disabled' : '')}>
          {loading ? '라이브 생성중 ...' : '라이브 시작'}
        </button>
      </form>
    </Layout>
  );
};

export default Create;
