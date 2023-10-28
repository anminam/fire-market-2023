import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AppLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log(router.data);
    router.replace('/');
  }, [router]);

  return <div>로그인 중입니다...</div>;
};

export default AppLoginPage;
