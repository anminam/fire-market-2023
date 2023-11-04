import ImageModal from '@/components/modal/ImageModal';
import useChat from '@/hooks/useChat';
import { useMiniStore } from '@/hooks/useStore';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface MiniProps {
  children: ReactNode;
}

interface LoginPageResult {
  result: boolean;
  data: {
    id: number;
    token: string;
  };
}

async function asyncGetSession<T>(): Promise<T | null> {
  try {
    const res = await fetch(`/api/sessions`);

    const json = await res.json();
    return json;
    // return json?.rooms || [];
  } catch (err) {
    // throw new Error(err as string);
  }
  return null;
}

function Mini({ children }: MiniProps) {
  const router = useRouter();
  const { setToken, setRooms, setUserId, token, isApp, initSendMessage, isImageModal, closeImageModal, imageModalSrc } =
    useMiniStore();

  const { rooms, sendMessage } = useChat(token);

  const [startFirebaseLogin, { loading, data, error: tokenError }] =
    useMutation<LoginPageResult>('/api/firebase/firebase-user');

  // 이거 왜 안되지??
  // const { data: sessionData } = useSWR<LoginPageResult>(isInit ? `/api/session/` : null);

  useEffect(() => {
    initSendMessage(sendMessage);
    // const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //   if (localStorage.getItem('isApp') === 'true') return;
    //   if (user) {
    //     const token = await user.getIdToken();
    //     startFirebaseLogin({
    //       email: user.email,
    //       uid: user.uid,
    //       token,
    //     });
    //   } else {
    //     setToken('');
    //   }
    //   return () => unsubscribe();
    // });

    async function fun() {
      const data = await asyncGetSession<LoginPageResult>();
      if (data?.data) {
        setToken(data.data.token);
        setUserId(data.data.id);
      }
    }

    fun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRooms(rooms);
  }, [rooms, setRooms]);

  useEffect(() => {
    if (data && data.result) {
      setToken(data.data.token);
      setUserId(data.data.id);
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      {children}
      <ImageModal />
    </div>
  );
}

export default Mini;
