import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const products = await client.product.findMany({
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
  if (req.method === 'POST') {
    const {
      body: { name, price, description, place, photoId },
      session: { user },
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: photoId,
        place,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      result: true,
      product,
    });
  }
}

export default withApiSession(
  withHandlers({ methods: ['POST', 'GET'], handler })
);
