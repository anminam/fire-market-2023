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

    await res.revalidate('/community');

    res.json({
      result: true,
      post,
    });
  }

  if (req.method === 'GET') {
    const posts = await client.post.findMany({
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
      posts,
    });
  }
}

export default withApiSession(
  withHandlers({ methods: ['POST', 'GET'], handler })
);
