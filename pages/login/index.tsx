import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { app } from '@/libs/client/firebase';
import Image from 'next/image';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';

interface LoginPageResult {
  result: boolean;
}

const LoginPage = () => {
  const [
    saveToken,
    { loading: tokenLoading, data: tokenData, error: tokenError },
  ] = useMutation<LoginPageResult>('/api/firebase/firebase-user');

  const router = useRouter();
  // 구글 로그인
  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      if (auth.currentUser) {
        const { displayName, email, uid } = auth.currentUser;
        saveToken({
          displayName,
          email,
          uid,
        });

        // 타이밍 이슈로 인해 1초 뒤에 홈으로 이동
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      }
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  return (
    <Layout title="로그인" isViewTabBar={false} isHideTitle={false}>
      <div className="flex flex-col justify-center items-center">
        <h1 className="m-6 text-2xl font-bold">화재장터 LOGIN</h1>
        <button
          className="btn bg-white text-gray-600 border border-gray-300 py-2 px-4 flex items-center"
          onClick={handleGoogleLogin}
        >
          <Image
            height={5}
            width={5}
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google 로고"
            className="w-5 h-5"
          />
          <span>Google 로그인</span>
        </button>
      </div>
    </Layout>
  );
};

export default LoginPage;
