import withHandlers from '@/libs/server/withHandlers';
import { NextApiRequest, NextApiResponse } from 'next';

import client from '@/libs/server/client';
import { withApiSession } from '@/libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: {
      user: true,
    },
  });

  if (!foundToken) {
    return res.status(404).end();
  }

  req.session.user = {
    id: foundToken.userId,
    token: foundToken.payload,
  };

  // 세션 저장.
  await req.session.save();

  // 세션 삭제.
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });

  // end
  res.json({
    result: true,
  });
}

export default withApiSession(
  withHandlers({
    methods: ['POST'],
    handler,
    isPrivate: false,
  })
);
