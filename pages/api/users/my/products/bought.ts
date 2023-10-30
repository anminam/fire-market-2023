import client from '@/libs/server/client';
import { errorNeedLogin } from '@/libs/server/error';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

interface ServerResponse {
  result: boolean;
  data: any;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ServerResponse>) {
  const { user } = req.session;

  const userId = user?.id;

  if (!userId) return errorNeedLogin(res);

  const data = await client.product.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    where: {
      buyerId: userId,
    },
    include: {
      _count: {
        select: {
          Favorite: true,
        },
      },
    },
    take: 20,
    skip: 0,
  });

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
