import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  // console.log('id', id);
  const data = await client.chatroom.findMany({
    where: {
      productId: +(id as string),
    },
    include: {
      buyer: true,
    },
  });

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
