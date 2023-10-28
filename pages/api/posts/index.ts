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
    const post = await client.post.create({
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
      data: post,
    });
  }

  if (req.method === 'GET') {
    const data = await client.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
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
            Wonderings: true,
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

export default withApiSession(
  withHandlers({ methods: ['POST', 'GET'], handler })
);
