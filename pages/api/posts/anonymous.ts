import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { question },
  } = req;

  const data = await client.post.create({
    data: {
      user: {
        connect: {
          id: 8,
        },
      },
      question,
    },
  });

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
