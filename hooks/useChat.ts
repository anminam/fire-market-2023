import {
  IChatMessage,
  IChatReceivedServerMessage,
  IChatSendMessage,
} from '@/interface/Chat';
import react from 'react';
import io, { Socket } from 'socket.io-client';
const URL = 'http://kklim.iptime.org:3003';
// const URL = process.env.URL_CHAT;

interface IUseChatInit {
  token: string;
  roomName: string;
}

const useChat = () => {
  const [currentUser, setCurrentUser] = react.useState<any>(null);
  const [room, setRoom] = react.useState<any>(null);
  const [rooms, setRooms] = react.useState<any>(null);
  const [socket, setSocket] = react.useState<Socket>();
  const [initInfo, init] = react.useState<IUseChatInit>();
  const [messages, setMessages] = react.useState<IChatMessage[]>([]);

  //소켓 연결 시작.
  const start = (token: string, roomName: string) => {
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
      try {
        // const list = await getRooms(token);
        // const findList = list.filter((_) => _.roomNm === roomName);
        // if (findList.length) {
        //   debugger;
        //   setMessages(findList[0].map(updateMessage));
        // }
        const list = await getServerChatMessage(token, roomName);
        setMessages(list.map(updateMessage));
      } catch (err) {
        // console.log(err);
      }
    });

    socket.on('recMessage', (message: IChatReceivedServerMessage) => {
      setMessages((prev) => [...prev, updateMessage(message)]);
    });

    setSocket(socket);
  };

  const sendMessage = (messageInfo: IChatSendMessage) => {
    socket?.emit('sendMessage', messageInfo);
  };

  return { start, socket, currentUser, room, sendMessage, messages };
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

async function getServerChatMessage(
  token: string,
  roomName: string
): Promise<IChatReceivedServerMessage[]> {
  try {
    const res = await fetch(`${URL}/api/chat/${roomName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const list = await res.json();
    return list;
  } catch (err) {
    throw new Error(err as string);
  }
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
