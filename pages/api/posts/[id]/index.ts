import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const data = await client.post.findUnique({
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
        take: 20,
        skip: 0,
      },
      _count: {
        select: {
          Answers: true,
          Interests: true,
        },
      },
    },
  });

  const isWondering = Boolean(
    await client.interest.findFirst({
      where: {
        postId: +(id as string),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    }),
  );

  res.json({
    result: true,
    data,
    isWondering,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
