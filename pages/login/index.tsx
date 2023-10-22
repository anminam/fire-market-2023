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
import { useEffect } from 'react';
import useFirebaseUser from '@/hooks/useFirebaseUser';

interface LoginPageResult {
  result: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const [saveToken, { loading, data, error: tokenError }] =
    useMutation<LoginPageResult>('/api/firebase/firebase-user');

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
