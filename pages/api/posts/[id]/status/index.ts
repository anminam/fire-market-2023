import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: { status },
  } = req;

  // 글 가져오기.
  const item = await client.post.findFirst({
    where: {
      id: +(id as string),
      userId: user?.id,
    },
  });

  // 글이 있으면 상태 업데이트.
  if (item) {
    await client.post.update({
      where: {
        id: +(id as string),
      },
      data: {
        statusCd: status,
      },
    });
  }
  //
  res.json({ result: true, status });
}

export default withApiSession(withHandlers({ methods: ['PATCH'], handler }));
