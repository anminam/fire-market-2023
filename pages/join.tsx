import type { NextPage } from 'next';
import { useEffect } from 'react';
import Button from '../components/button';
import Input from '../components/input';
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';

import 'react-loading-skeleton/dist/skeleton.css';

interface JoinForm {
  email?: string;
}

interface TokenForm {
  token: string;
}

interface JoinMutationResult {
  result: boolean;
}

const Join: NextPage = () => {
  const [apiJoin, { loading, data, error }] =
    useMutation<JoinMutationResult>('/api/users/join');

  const [
    apiToken,
    { loading: tokenLoading, data: tokenData, error: tokenError },
  ] = useMutation<JoinMutationResult>('/api/users/token-confirm');

  const { register, watch, reset, handleSubmit } = useForm<JoinForm>();
  const { register: tokenRegister, handleSubmit: tokenHandleSubmitCreate } =
    useForm<TokenForm>();

  // 가입하기 클릭
  const onValid = (formData: JoinForm) => {
    apiJoin(formData);
  };

  // 토큰확인 클릭
  const onTokenValid = (formData: TokenForm) => {
    if (tokenLoading) {
      return;
    }
    apiToken(formData);
  };

  const router = useRouter();
  useEffect(() => {
    if (tokenData?.result) {
      router.push('/');
    }
  }, [tokenData, router]);
  useEffect(() => {
    if (data?.result) {
      reset();
    }
  }, [data?.result, reset]);

  return (
    <div className="mt-16 px-4">
      <h3 className="text-3xl font-bold text-center">인증받기</h3>
      <div className="mt-12">
        {data?.result ? (
          <form
            className="flex flex-col mt-8 space-y-4"
            onSubmit={tokenHandleSubmitCreate(onTokenValid)}
          >
            <Input
              register={tokenRegister('token', { required: true })}
              name="token"
              label="이메일을 확인하고 인증번호를 넣어주세요"
              placeholder="예) 123456"
              type="number"
              required
            />

            <Button text={tokenLoading ? '기다리는 중...' : '토큰 확인'} />
          </form>
        ) : (
          <>
            <form
              className="flex flex-col mt-8 space-y-4"
              onSubmit={handleSubmit(onValid)}
            >
              <Input
                register={register('email', { required: true })}
                name="email"
                label="이메일"
                type="email"
              />
              <Button text={loading ? '기다리는 중...' : '만들기'} />
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default Join;
