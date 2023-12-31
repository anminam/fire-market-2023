import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {
      query: { take, page },
    } = req;

    const data = await client.product.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        OR: [
          {
            status: {
              name: 'SALE',
            },
          },
          {
            status: {
              name: 'RSRV',
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
      take: +(take || 20),
      skip: +(page || 0) * +(take || 20),
    });
    res.json({
      result: true,
      data,
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
      const data = await client.product.update({
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
        data,
      });
      return;
    }

    // Create a new product
    const data = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: photoId,
        place,
        status: {
          connect: {
            name: 'SALE',
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      result: true,
      data,
    });
  }
}

export default withApiSession(withHandlers({ methods: ['POST', 'GET'], handler }));
