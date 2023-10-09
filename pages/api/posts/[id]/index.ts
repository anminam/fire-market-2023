import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: +(id as String),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      Answers: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        take: 10,
        skip: 10,
      },
      _count: {
        select: {
          Answers: true,
          Wonderings: true,
        },
      },
    },
  });

  const isWondering = Boolean(
    await client.wondering.findFirst({
      where: {
        postId: +(id as string),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({
    result: true,
    post,
    isWondering,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
