import Layout from '@/components/layout';
import { useMiniStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

interface AppLoginData {
  token: string;
  id: number;
}

const AppLoginPage = () => {
  const router = useRouter();
  const { setToken, setUserId, setIsApp } = useMiniStore();
  const [message, setMessage] = useState('');

  /**
   * 로그인
   */
  const login = useCallback(
    (token: string, id: number) => {
      if (!router.isReady) return;

      localStorage.setItem('isApp', 'true');
      setToken(token);
      setUserId(id);

      // 이동.
      router.replace('/');
    },
    [router.isReady],
  );

  useEffect(() => {
    if (!router.isReady) return;
    const queryData = router.query.data as string;

    // data 없으면 종료.
    if (!queryData) {
      setMessage('정보를 불러올 수 없습니다');
      return;
    }
    // 셋팅.
    const data: AppLoginData = JSON.parse(atob(queryData));
    login(data.token, data.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <Layout title="로그인" isViewTabBar={false} isHideTitle={false}>
      <div className="flex flex-col justify-center items-center">
        {message ? <div>{message}</div> : <div className="font-bold animate-pulse">화재장터에 로그인 중입니다...</div>}
      </div>
    </Layout>
  );
};

export default AppLoginPage;
