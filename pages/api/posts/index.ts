import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { question, lat, lng },
    session: { user },
  } = req;

  if (req.method === 'POST') {
    const data = await client.post.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        question,
        latitude: lat,
        longitude: lng,
      },
    });

    res.json({
      result: true,
      data,
    });
  }

  if (req.method === 'GET') {
    const data = await client.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        NOT: [
          {
            status: {
              name: 'DLTE',
            },
          },
          {
            status: {
              name: 'HIDE',
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Answers: true,
            Interests: true,
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
