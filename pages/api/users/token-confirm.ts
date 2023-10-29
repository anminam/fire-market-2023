/**
 * 토큰(인증번호(숫자로됨)) 가져와서 DB에있는 사용자 맞는지 확인.
 * 이메일 검증을 위해 만들었는데 사용하지 않음.
 */
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
  }),
);
