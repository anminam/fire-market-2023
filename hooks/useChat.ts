import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
const URL = 'http://kklim.iptime.org:3003';
// const URL = process.env.URL_CHAT;

const useChat = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [rooms, setRooms] = useState<any>(null);
  const [socket, setSocket] = useState<Socket>();
  const [token, setToken] = useState<string>('');

  //소켓 연결 시작.
  const connectStart = (token: string) => {
    if (!URL) {
      throw new Error('URL_CHAT is undefined');
    }

    const socket = io(URL, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
    });

    socket.connect();

    socket.on('connect', async () => {
      const list = await getRooms(token);
    });

    socket.on('recMessage', (message) => {
      debugger;
    });
    // socket.emit('sendMessage', message);
    setSocket(socket);
  };

  useEffect(() => {
    if (token) {
      connectStart(token);
    }
  }, [token]);

  return { setToken, socket, currentUser, room };
};

async function getRooms(token: string) {
  debugger;
  const res = await fetch(`${URL}/api/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = (response: Response) => response.json();
  debugger;
  // .then((response) => response.json())
  // .then(({ rooms: data }) => {
  //   debugger;
  //   data.forEach((el) => {
  //     rooms.push(el);
  //   });
  // })
  // .catch((err) => console.error(err));
}

export default useChat;
