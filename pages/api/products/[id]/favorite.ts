import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const favItem = await client.favorite.findFirst({
    where: {
      productId: +(id as string),
      userId: user?.id,
    },
  });

  if (favItem) {
    await client.favorite.delete({
      where: {
        id: favItem.id,
      },
    });
  } else {
    await client.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +(id?.toString() as String),
          },
        },
      },
    });
  }
  //
  res.json({ result: true });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
