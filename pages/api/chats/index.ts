import { IChatManager, IChatServerManager } from '@/interface/Chat';
import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const sellingChat = await client.chat.findMany({
  //   where: {
  //     buyingUserId: req.session.user?.id,
  //   },
  //   include: {
  //     product: true,
  //     sellingUser: true,
  //     buyingUser: true,
  //   },
  // });
  // const buyingChat = await client.chat.findMany({
  //   where: {
  //     buyingUserId: req.session.user?.id,
  //   },
  //   include: {
  //     product: true,
  //     sellingUser: true,
  //     buyingUser: true,
  //   },
  // });
  // const chats = [...sellingChat, ...buyingChat];
  // const result = removeDuplicateIds(updateChatList(chats));
  // res.json({
  //   result: true,
  //   data: result,
  // });
}

const updateChatList = (list: IChatServerManager[]): IChatManager[] => {
  return list.map((chat: IChatServerManager) => {
    const { id, product, sellingUser, buyingUser } = chat;
    return {
      id,
      product,
      sellingUser: {
        id: sellingUser.id,
        name: sellingUser.name,
        email: sellingUser.email,
        avatar: sellingUser.avatar,
      },
      buyingUser: {
        id: buyingUser.id,
        name: buyingUser.name,
        email: buyingUser.email,
        avatar: buyingUser.avatar,
      },
    };
  });
};

type UserWithId = {
  id: number;
};

function removeDuplicateIds<T extends UserWithId>(items: T[]): T[] {
  const list = new Set<number>();
  return items.filter((item) => {
    if (list.has(item.id)) return false;
    if (list.add(item.id)) return true;
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
