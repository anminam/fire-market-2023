import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  const user = await client.user.findFirst({
    where: {
      id,
    },
  });

  if (user) {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    res.json({ result: true, data });
  } else {
    res.status(404).end();
  }
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
