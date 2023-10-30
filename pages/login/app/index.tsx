import Layout from '@/components/layout';
import { useMiniStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AppLoginPage = () => {
  const router = useRouter();
  const { setToken, setUserId, setIsApp } = useMiniStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 준비되지 않으면 종료.
    if (!router.isReady) return;

    // data 없으면 종료.
    if (!router.query.data) {
      // setMessage('정보를 불러올 수 없습니다');
      return;
    }

    const data = JSON.parse(atob(router.query.data as string));
    setIsApp(true);
    setToken(data.token);
    setUserId(data.id);
    console.log('anlog', 'AppLoginPage', data.token);
    router.replace('/');
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
