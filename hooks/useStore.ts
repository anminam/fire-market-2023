import { IChatMessage, IChatReceivedRoomInfo, IChatReceivedServerMessage, IRoom } from '@/interface/Chat';
import { ProductStatus } from '@/interface/ProductKind';
import { ITheme } from '@/interface/Theme';
import { chatUrl } from '@/libs/client/url';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MiniState {
  bears: number;
  rooms: IRoom[];
  roomsCount: number;
  roomsReadCount: number;
  token: string;
  userId: number;
  isImageModal: boolean;
  imageModalSrc: string;
  increase: (by: number) => void;
  // firebaseAuth: () => void;
  setToken: (token: string) => void;
  setRooms: (rooms: IRoom[]) => void;
  setUserId: (userId: number) => void;
  readChat: (roomName: string) => void;
  isApp: boolean;
  setIsApp: (isApp: boolean) => void;
  initSendMessage: (func: (roomName: string, text: string) => void) => void;
  sendMessage: (roomName: string, text: string) => void;
  getMessage: (roomName: string) => Promise<IChatMessage[]>;
  emitMessage: ((roomName: string, text: string) => void) | null;
  setImageModalSrc: (src: string) => void;
  closeImageModal: () => void;
  theme: ITheme;
  setTheme: (theme: ITheme) => void;
  setRoomState: (productId: number, buyerId: number, state: ProductStatus) => void;
}

export const useMiniStore = create<MiniState>()(
  devtools((set) => ({
    bears: 0,
    rooms: [],
    roomsCount: 0,
    roomsReadCount: 0,
    token: '',
    userId: 0,
    isApp: false,
    emitMessage: null,
    isImageModal: false,
    imageModalSrc: '',
    theme: '' as ITheme,
    increase: (by) =>
      set((state) => {
        return { bears: state.bears + by };
      }),
    setUserId: (userId: number) => {
      set((state) => {
        return { ...state, userId };
      });
    },
    setToken: (token: string) => {
      // 토큰이 빈 값의 경우 제외 처리
      if (token == '') return;
      console.log('토큰바뀐다', token);
      set((state) => {
        return { ...state, token };
      });
    },
    setRooms: (rooms: IRoom[]) => {
      set((state) => {
        const roomsReadCount = getRoomsReadCount(rooms, state.userId);
        const roomsCount = rooms.length;

        return { ...state, rooms: [...rooms], roomsReadCount, roomsCount };
      });
    },
    readChat: (roomName: string) => {
      set((state) => {
        const room = getRoom(state.rooms, roomName);
        if (!room) {
          return state;
        }

        const maxCount = Number(room.text.split('::')[0]);
        if (state.userId === room.buyerId) {
          room.buyerReadId = maxCount;
        } else {
          room.sellerReadId = maxCount;
        }

        asyncReadChat(state.token, roomName, Number(room.text.split('::')[0]));
        const roomsReadCount = getRoomsReadCount(state.rooms, state.userId);

        return { ...state, rooms: [...state.rooms], roomsReadCount };
      });
    },
    setIsApp: (isApp: boolean) => {
      set((state) => {
        return { ...state, isApp };
      });
    },
    initSendMessage: (func: (roomName: string, text: string) => void) => {
      set((state) => {
        return { ...state, emitMessage: func };
      });
    },
    sendMessage: (roomName: string, text: string) => {
      useMiniStore.getState().emitMessage?.(roomName, text);
      set((state) => {
        return state;
      });
    },
    getMessage: async (roomName: string): Promise<IChatMessage[]> => {
      const rooms = useMiniStore.getState().rooms;
      const token = useMiniStore.getState().token;
      const room = rooms.find((room) => room.roomNm === roomName);
      if (!room) {
        return [];
      }
      const info = await getServerChatMessage(token, roomName);
      const updateMessages = info.messages.map((message) => updateMessage(message));
      return updateMessages;
    },
    closeImageModal: () => {
      set((state) => {
        return { ...state, isImageModal: false, imageModalSrc: '' };
      });
    },
    setImageModalSrc: (src: string) => {
      set((state) => {
        return { ...state, isImageModal: true, imageModalSrc: src };
      });
    },
    setTheme: (theme: ITheme) => {
      set((state) => {
        return { ...state, theme };
      });
    },
    setRoomState: (productId: number, buyerId: number, productState: ProductStatus) => {
      set((state) => {
        const { rooms } = state;
        const findRooms = rooms.filter((room) => room.productId === productId);
        if (findRooms.length === 0) return state;

        findRooms.forEach((room) => {
          room.product = {
            ...room.product,
            statusCd: productState,
            buyerId: buyerId,
          };
        });

        return { ...state, rooms: [...rooms] };
      });
    },
  })),
);

function getRoom(rooms: IRoom[], roomName: string): IRoom | null {
  for (const room of rooms) {
    if (room.roomNm === roomName) {
      return room;
    }
  }

  return null;
}

function getRoomsReadCount(rooms: IRoom[], userId: number) {
  const count = rooms.reduce((prev, room) => {
    const maxCount = Number(room.text.split('::')[0]);
    const readCount = userId === room.buyerId ? room.buyerReadId : room.sellerReadId;

    // const count = maxCount - readCount;
    // !TODO: 일단은 카운트 무조건 0으로
    const count = maxCount - readCount > 0 ? 1 : 0;
    room.readCount = count;

    return prev + count;
  }, 0);

  return count;
}

async function asyncReadChat(token: string, roomName: string, readChatId: number): Promise<void> {
  console.log('anlog', 'asyncReadChat', token);
  try {
    const res = await fetch(`${chatUrl}/api/chat/${roomName}/${readChatId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    // return json?.rooms || [];
  } catch (err) {
    // throw new Error(err as string);
  }
}
async function getServerChatMessage(token: string, roomName: string): Promise<IChatReceivedRoomInfo> {
  console.log('anlog', 'getServerChatMessage', token);
  try {
    const res = await fetch(`${chatUrl}/api/chat/${roomName}`, {
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
