import {
  IChatMessage,
  IChatReceivedRoomInfo,
  IChatReceivedServerMessage,
  IChatSendMessage,
} from '@/interface/Chat';
import react, { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
const URL = 'http://kklim.iptime.org:3003';
// const URL = process.env.URL_CHAT;

interface IUseChatInit {
  token: string;
  roomName: string;
}

interface IRoomName {
  productId: number;
  sellerId: number;
  buyerId: number;
}

const useChat = () => {
  const [currentUser, setCurrentUser] = react.useState<any>(null);
  const [room, setRoom] = react.useState<any>(null);
  const [rooms, setRooms] = react.useState<any>(null);
  const [_socket, setSocket] = react.useState<Socket>();
  const [initInfo, init] = react.useState<IUseChatInit>({
    roomName: '',
    token: '',
  });
  const [messages, setMessages] = react.useState<IChatMessage[]>([]);
  const [roomId, setRoomId] = react.useState<string>('');

  const makeChatRoomId = ({
    productId,
    sellerId,
    buyerId,
  }: IRoomName): string => {
    // 상품ID-판매자ID-구매자ID
    return `${productId}-${sellerId}-${buyerId}`;
  };

  //소켓 연결 시작.
  useEffect(() => {
    if (!URL) {
      throw new Error('URL_CHAT is undefined');
    }
    if (_socket) return;
    if (!initInfo?.token || !initInfo?.roomName) return;

    const socket = io(URL, {
      auth: {
        token: `Bearer ${initInfo?.token}`,
      },
      transports: ['websocket', 'polling'],
    });

    socket?.on('connect', async () => {
      try {
        // const list = await getRooms(token);
        // const findList = list.filter((_) => _.roomNm === roomName);
        // if (findList.length) {
        //   debugger;
        //   setMessages(findList[0].map(updateMessage));
        // }
        console.log('연결');

        const list = await getServerChatMessage(
          initInfo.token,
          initInfo.roomName
        );

        setMessages(list.messages.map(updateMessage));
      } catch (err) {
        // console.log(err);
      }
    });

    socket?.on('recMessage', (message: IChatReceivedServerMessage) => {
      setMessages(prev => [...prev, updateMessage(message)]);
    });

    setSocket(socket);
  }, [_socket, initInfo, setMessages, setSocket]);

  const sendMessage = (text: string) => {
    _socket?.emit('sendMessage', { text, roomNm: initInfo.roomName });
  };

  return {
    init,
    currentUser,
    room,
    sendMessage,
    messages,
    makeChatRoomId,
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

async function getServerChatMessage(
  token: string,
  roomName: string
): Promise<IChatReceivedRoomInfo> {
  try {
    const res = await fetch(`${URL}/api/chat/${roomName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
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
