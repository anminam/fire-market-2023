import { useMiniStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AppLoginPage = () => {
  const router = useRouter();
  const { setToken, setUserId, setIsApp } = useMiniStore();

  useEffect(() => {
    console.log('query.data', 's', '----------------');
    console.log(router.query.data);
    console.log('query.data', 'n', '----------------');
    const data = JSON.parse(atob(router.query.data as string));
    console.log('data', 's', '----------------');
    console.log(data.id);
    console.log('data', 'n', '----------------');
    setIsApp(true);
    setToken(data.token);
    setUserId(data.id);
    router.replace('/');
  }, [router, setIsApp, setToken, setUserId]);

  return <div>로그인 중입니다...</div>;
};

export default AppLoginPage;
