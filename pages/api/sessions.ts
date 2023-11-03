import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;

  res.json({
    result: true,
    data: user,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
