import { useMiniStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AppLoginPage = () => {
  const router = useRouter();
  const { setToken, setUserId } = useMiniStore();

  useEffect(() => {
    console.log(router.query.data);
    const data = JSON.parse(atob(router.query.data));
    console.log(data.id);
    setToken(data.token);
    setUserId(data.id);
    router.replace('/');
  }, [router]);

  return <div>로그인 중입니다...</div>;
};

export default AppLoginPage;
