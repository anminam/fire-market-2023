import { useMiniStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AppLoginPage = () => {
  const router = useRouter();
  const { setToken, setUserId, setIsApp } = useMiniStore();

  useEffect(() => {
    if (!router.isReady) return;

    const data = JSON.parse(atob(router.query.data as string));
    setIsApp(true);
    setToken(data.token);
    setUserId(data.id);
    console.log('anlog', 'AppLoginPage', data.token);
    router.replace('/');
  }, [router.isReady, setIsApp, setToken, setUserId]);

  return <div>로그인 중입니다...</div>;
};

export default AppLoginPage;
