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

  // 상품 가져오기.
  const item = await client.product.findFirst({
    where: {
      id: +(id as string),
      userId: user?.id,
    },
  });

  if (item) {
    // 상품이 있으면 상태 업데이트
    await client.product.update({
      where: {
        id: +(id as string),
      },
      data: {
        status,
      },
    });
  }
  //
  res.json({ result: true });
}

export default withApiSession(withHandlers({ methods: ['PATCH'], handler }));
