import useChat from '@/hooks/useChat';
import { useMiniStore } from '@/hooks/useStore';
import { auth } from '@/libs/client/firebase';
import { ReactNode, useEffect } from 'react';

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

function Mini({ children }: MiniProps) {
  const { setToken, setRooms, setUserId, token, isApp, initSendMessage } = useMiniStore();

  const { rooms, sendMessage } = useChat(token);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (localStorage.getItem('isApp') === 'true') return;
      if (user) {
        const token = await user.getIdToken();
        console.log('g', 'auth.onAuthStateChanged', '셋팅한다');
        setToken(token);
        console.log('g', 'auth.onAuthStateChanged', token);
        console.log('g', 'auth.onAuthStateChanged', '셋팅했다');
        const userRes = await asyncUser();
        if (!userRes.data) return;
        setUserId(userRes.data.id);
      } else {
        useMiniStore.setState({ token: '' });
      }
      return () => unsubscribe();
    });
  }, [isApp]);

  useEffect(() => {
    setRooms(rooms);
  }, [rooms, setRooms]);
  useEffect(() => {
    initSendMessage(sendMessage);
  }, []);

  return <div>{children}</div>;
}

export default Mini;
