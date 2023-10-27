import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;
  const products = await client.product.findMany({
    where: {
      user: {
        id: user?.id,
      },
      NOT: {
        statusCd: 'DLTE',
      },
    },
    include: {
      _count: {
        select: {
          Favorite: true,
        },
      },
    },
  });
  res.json({
    result: true,
    products,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
