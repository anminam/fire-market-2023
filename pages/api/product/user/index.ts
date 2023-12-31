import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;

  const data = await client.product.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    where: {
      userId: user?.id,
      NOT: [
        {
          status: {
            name: 'DLTE',
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          Favorite: true,
          chatroom: true,
        },
      },
    },
  });

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
