import { IRoom } from '@/interface/Chat';
import { chatUrl } from '@/libs/client/url';
import { create } from 'zustand';

interface MiniState {
  bears: number;
  rooms: IRoom[];
  roomsCount: number;
  roomsReadCount: number;
  token: string;
  userId: number;
  increase: (by: number) => void;
  // firebaseAuth: () => void;
  setToken: (token: string) => void;
  setRooms: (rooms: IRoom[]) => void;
  setUserId: (userId: number) => void;
  readChat: (roomName: string) => void;
}

async function refreshToken() {
  // 파이어베이스 토큰 리프레시
  // const user = await auth.
}

export const useMiniStore = create<MiniState>()(set => ({
  bears: 0,
  rooms: [],
  roomsCount: 0,
  roomsReadCount: 0,
  token: '',
  userId: 0,
  increase: by =>
    set(state => {
      return { bears: state.bears + by };
    }),
  setUserId: (userId: number) => {
    set(state => {
      return { ...state, userId };
    });
  },
  setToken: (token: string) => {
    set(state => {
      return { ...state, token };
    });
  },
  setRooms: (rooms: IRoom[]) => {
    set(state => {
      const roomsReadCount = getRoomsReadCount(rooms, state.userId);
      const roomsCount = rooms.length;
      return { ...state, rooms, roomsReadCount, roomsCount };
    });
  },
  readChat: (roomName: string) => {
    set(state => {
      const room = state.rooms.find(room => room.roomNm === roomName);
      if (!room) {
        return state;
      }

      asyncReadChat(state.token, roomName, Number(room.text.split('::')[0]));
      return state;
    });
  },
}));

function getRoomsReadCount(rooms: IRoom[], userId: number) {
  const count = rooms.reduce((prev, room) => {
    const maxCount = Number(room.text.split('::')[0]);
    const readCount =
      userId === room.buyerId ? room.buyerReadId : room.sellerReadId;

    const count = maxCount - readCount;
    room.readCount = count;

    return prev + count;
  }, 0);
  return count;
}

async function asyncReadChat(
  token: string,
  roomName: string,
  readChatId: number
): Promise<void> {
  try {
    const res = await fetch(`${chatUrl}/api/chat/${roomName}/${readChatId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    console.log(json);
    // return json?.rooms || [];
  } catch (err) {
    // throw new Error(err as string);
  }
}
