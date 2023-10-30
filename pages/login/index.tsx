import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/libs/client/firebase';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useEffect } from 'react';

interface LoginPageResult {
  result: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const [saveToken, { loading, data, error: tokenError }] = useMutation<LoginPageResult>('/api/firebase/firebase-user');

  // 구글 로그인
  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      if (auth.currentUser) {
        const { displayName, email, uid } = auth.currentUser;
        const token = await auth.currentUser.getIdToken();
        saveToken({
          displayName,
          email,
          uid,
          token,
        });
      }
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  useEffect(() => {
    if (data?.result) {
      router.replace('/');
    }
  }, [router, data]);

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
            {loading ? (
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
