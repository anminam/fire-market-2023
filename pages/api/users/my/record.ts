import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { Kind } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { kind },
  } = req;

  if (req.method === 'POST') {
    const record = await client.recode.findUnique({
      where: {
        id: req.session.user?.id,
        Kind: getKind(kind as string),
      },
    });

    res.json({
      result: true,
      record,
    });
  }

  if (req.method === 'GET') {
    const records = await client.recode.findMany({
      where: {
        userId: user?.id,
        Kind: getKind(kind as string),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });

    res.json({
      result: true,
      records,
    });
  }
}
const getKind = (kind: string): Kind => {
  return kind as Kind;
};

export default withApiSession(
  withHandlers({ methods: ['GET', 'POST'], handler })
);
