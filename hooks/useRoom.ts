import { IRoom } from '@/interface/Chat';
import { tokenFetcher } from '@/libs/client/fetcher';
import { chatUrl } from '@/libs/client/url';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface IRoomResponse {
  rooms: IRoom[];
}

const useRoom = (roomId: string) => {
  const [room, setRoom] = useState<IRoom>();

  const [token, setToken] = useState<string>('');

  const { data, isLoading, error } = useSWR<IRoomResponse>(
    token ? [`${chatUrl}/api/rooms`, token] : null,
    tokenFetcher
  );

  useEffect(() => {
    if (!data || !data?.rooms?.length) return;

    const room = data.rooms.filter(room => room.roomNm === roomId)[0];
    setRoom(room);
  }, [data, roomId]);

  return {
    room,
    isLoading,
    setToken,
  };
};

export default useRoom;
