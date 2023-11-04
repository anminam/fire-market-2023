import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: { message },
  } = req;

  await client.postClaim.create({
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
      message,
    },
  });

  res.json({
    result: true,
  });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
