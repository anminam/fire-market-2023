import { useMiniStore } from '@/hooks/useStore';
import { IRoom } from '@/interface/Chat';
import { auth } from '@/libs/client/firebase';
import { chatUrl } from '@/libs/client/url';
import { ReactNode, useEffect } from 'react';

interface MiniProps {
  children: ReactNode;
}

async function asyncGetRooms(token: string): Promise<IRoom[]> {
  try {
    const res = await fetch(`${chatUrl}/api/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    return json?.rooms || [];
  } catch (err) {
    return [];
    // throw new Error(err as string);
  }
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
  const { setToken, setRooms, setUserId, token } = useMiniStore();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      console.log('g', 'auth.onAuthStateChanged', '시작한다');

      if (user) {
        const token = await user.getIdToken();
        console.log('g', 'auth.onAuthStateChanged', '셋팅한다');
        setToken(token);
        console.log('g', 'auth.onAuthStateChanged', token);
        console.log('g', 'auth.onAuthStateChanged', '셋팅했다');
        const userRes = await asyncUser();
        setUserId(userRes.data.id);
      } else {
        useMiniStore.setState({ token: '' });
      }
      return () => unsubscribe();
    });
  }, [setRooms, setToken, setUserId]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (token === '') return;
      const rooms = await asyncGetRooms(token);
      setRooms(rooms);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [setRooms, token]);

  return <div>{children}</div>;
}

export default Mini;
