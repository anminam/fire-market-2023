import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { text, lat, lng },
    session: { user },
  } = req;

  const data = await client.ask.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      text,
    },
  });

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
