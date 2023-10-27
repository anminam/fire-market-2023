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

  // 상품이 있으면 상태 업데이트
  if (item) {
    // status 가 예약중이면 바이어 삭제 아니면 바이어 추가
    const buyerId = ['CMPL'].includes(status) ? item.buyerId || null : null;

    await client.product.update({
      where: {
        id: +(id as string),
      },
      data: {
        statusCd: status,
        buyerId,
      },
    });
  }
  //
  res.json({ result: true, status });
}

export default withApiSession(withHandlers({ methods: ['PATCH'], handler }));
