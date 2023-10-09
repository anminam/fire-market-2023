import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: { answer },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: +(id as String),
    },
    select: {
      id: true,
    },
  });

  // post 없으면 에러.
  if (!post) {
    res.json({
      result: false,
    });
  }

  const data = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +(id as String),
        },
      },
      answer,
    },
  });

  res.json({
    result: true,
    answer: data,
  });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
