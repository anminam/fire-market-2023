import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sellingChat = await client.chat.findMany({
    where: {
      buyingUserId: req.session.user?.id,
    },
  });
  const buyingChat = await client.chat.findMany({
    where: {
      buyingUserId: req.session.user?.id,
    },
  });

  const chats = [...sellingChat, ...buyingChat];
  res.json({
    result: true,
    data: chats,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
