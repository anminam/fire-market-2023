import withHandlers from '@/libs/server/withHandlers';
import { NextApiRequest, NextApiResponse } from 'next';

import { withApiSession } from '@/libs/server/withSession';
import { app } from '@/libs/client/firebase';
import { getAuth } from 'firebase/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 세션 삭제
  await req.session.destroy();

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
  }),
);
