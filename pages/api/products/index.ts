import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const products = await client.product.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        // status 가 CNCL가 아닌것만 가져온다.
        NOT: {
          status: 'CNCL',
        },
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
      products,
    });
  }
  if (req.method === 'POST') {
    const {
      body: { name, price, description, place, photoId, id },
      session: { user },
    } = req;

    // id가 있으면 수정
    if (id) {
      const {
        body: { name, price, description, place, photoId, id },
        session: { user },
      } = req;
      const product = await client.product.update({
        where: {
          id: +id,
        },
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
      return;
    }

    // Create a new product
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
