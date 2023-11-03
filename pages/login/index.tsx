import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app, auth, normalLogin } from '@/libs/client/firebase';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useEffect } from 'react';
import { useMiniStore } from '@/hooks/useStore';

interface LoginPageResult {
  result: boolean;
  data: {
    id: number;
    token: string;
  };
}

const LoginPage = () => {
  const router = useRouter();
  const [logout] = useMutation<LoginPageResult>('/api/users/logout');
  const { setToken, setRooms, setUserId, token, isApp, initSendMessage } = useMiniStore();

  const [startFirebaseLogin, { loading, data, error: tokenError }] =
    useMutation<LoginPageResult>('/api/firebase/firebase-user');

  // 구글 로그인
  const handleGoogleLogin = async () => {
    const res = await normalLogin();
    if (res?.token) {
      setToken(res.token);
      startFirebaseLogin({
        email: res.email,
        uid: res.uid,
        token: res.token,
      });
    }
  };

  useEffect(() => {
    if (data && data.result) {
      setToken(data.data.token);
      setUserId(data.data.id);
      router.replace('/');
    }
  }, [data]);

  const initPage = async () => {
    await auth.signOut();
    logout(null);
    setToken('');
  };

  // effect - 최초진입
  useEffect(() => {
    // 일단 로그아웃 때리고 시작
    if (localStorage.getItem('isApp') !== 'true') {
      initPage();  
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="로그인" isViewTabBar={false} isHideTitle={false}>
      <div className="flex flex-col justify-center items-center">
        {/* 상단 문구 */}
        <div className="w-56">
          <div className="flex flex-col w-full">
            <h1 className="text-3xl font-bold animate-[intro_1s]">화재장터</h1>
            <div className="text-sm text-neutral-500 animate-intro">우리들의 소소한 이야기</div>
          </div>
          {/* 버튼 */}
          <div className="mt-20 flex items-center">
            {false ? (
              <div className="loading loading-spinner loading-lg"></div>
            ) : (
              <button
                className="btn bg-white text-gray-600 border border-gray-300 py-2 px-4 flex items-center w-full"
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google 로고"
                  className="w-5 h-5"
                />
                <span>Google 로그인</span>
              </button>
            )}
          </div>
          <div className="mt-10 text-xs items-center flex justify-center">
            <p>@2023 러닝크루 화재장터</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
