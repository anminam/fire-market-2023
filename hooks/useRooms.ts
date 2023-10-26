import {
  IChatMessage,
  IChatReceivedRoomInfo,
  IChatReceivedServerMessage,
} from '@/interface/Chat';
import react, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useRooms = () => {
  const [rooms, setRooms] = useState<IChatMessage[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  //소켓 연결 시작.
  useEffect(() => {
    if (!token) return;

    async function init() {
      setLoading(true);
      try {
        const a = await getRooms(token);
        debugger;
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [token]);

  return {
    rooms,
    isLoading,
    setToken,
  };
};

async function getRooms(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${URL}/api/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json?.rooms;
  } catch (err) {
    throw new Error(err as string);
  }
}

export default useRooms;
