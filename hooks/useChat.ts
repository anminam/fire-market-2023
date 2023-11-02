import { IChatMessage, IChatReceivedServerMessage, IRoom } from '@/interface/Chat';
import { chatUrl } from '@/libs/client/url';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let _socket: Socket | null = null;

const useChat = (initToken: string) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const router = useRouter();

  //소켓 연결 시작.
  useEffect(() => {
    if (!URL) {
      throw new Error('URL_CHAT is undefined');
    }

    if (_socket) return;
    if (!initToken) return;

    _socket = io(chatUrl, {
      auth: {
        token: `Bearer ${initToken}`,
      },
      transports: ['websocket', 'polling'],
    });

    _socket?.on('connect', async () => {
      try {
        const rooms = await asyncGetRooms(initToken);
        setRooms(rooms);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === '403') {
            router.push('/login');
          }
        }
      }
    });

    _socket?.on('recMessage', async (message: IChatReceivedServerMessage) => {
      try {
        const rooms = await asyncGetRooms(initToken);
        setRooms(rooms);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === '403') {
            router.push('/login');
          }
        }
      }
      setMessages((prev) => [...prev, updateMessage(message)]);
    });

    return () => {
      if (_socket && _socket.connected) {
        _socket?.disconnect();
      }
    };
  }, [initToken]);

  const sendMessage = useCallback(
    (roomName: string, text: string) => {
      rooms;
      if (!_socket) {
        debugger;
        return;
      }
      _socket.emit('sendMessage', { text, roomNm: roomName });
    },
    [rooms],
  );

  return {
    rooms,
    sendMessage,
    messages,
  };
};

async function asyncGetRooms(token: string): Promise<IRoom[]> {
  const res = await fetch(`${chatUrl}/api/rooms`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}1`,
    },
  });

  if (res.status === 403) {
    throw new Error(res.status.toString());
  }

  const json = await res.json();
  return json?.rooms || [];
}

// IChatReceivedServerMessage to IChatMessage change function
function updateMessage(message: IChatReceivedServerMessage): IChatMessage {
  const date = new Date(message.createdAt);
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = (date.getHours() % 12).toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const isAm = date.getHours() < 12 ? true : false;
  const format = `${isAm ? '오전' : '오후'} ${hour}:${minute}`;

  return {
    id: message.id,
    roomNm: message.roomNm,
    text: message.text,
    userId: message.userId,
    date: {
      year,
      month,
      day,
      hour,
      minute,
      format,
      isAm,
    },
  };
}

export default useChat;
