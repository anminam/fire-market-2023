import useChat from '@/hooks/useChat';
import { useMiniStore } from '@/hooks/useStore';
import { auth } from '@/libs/client/firebase';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { ReactNode, use, useEffect, useState } from 'react';

interface MiniProps {
  children: ReactNode;
}

async function asyncUser() {
  try {
    const res = await fetch('/api/users/my');

    const json = await res.json();
    return json;
  } catch (err) {
    return [];
    // throw new Error(err as string);
  }
}
interface LoginPageResult {
  result: boolean;
  data: {
    id: number;
    token: string;
  };
}

function Mini({ children }: MiniProps) {
  const router = useRouter();
  const { setToken, setRooms, setUserId, token, isApp, initSendMessage } = useMiniStore();

  const { rooms, sendMessage } = useChat(token);

  const [startFirebaseLogin, { loading, data, error: tokenError }] =
    useMutation<LoginPageResult>('/api/firebase/firebase-user');

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
  }, []);

  useEffect(() => {
    setRooms(rooms);
  }, [rooms, setRooms]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (data && data.result) {
      setIsMounted(true);
      setToken(data.data.token);
      setUserId(data.data.id);
      router.replace('/');
    }
  }, [data]);

  return <div>{children}</div>;
}

export default Mini;
