import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: { status, buyerId },
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
    let tempBuyerId = ['CMPL'].includes(status) ? item.buyerId || null : null;
    // body에 buyerId 가 있으면 그걸로 바꿔준다.
    if (buyerId) {
      tempBuyerId = +(buyerId as string);
    }

    await client.product.update({
      where: {
        id: +(id as string),
      },
      data: {
        statusCd: status,
        buyerId: tempBuyerId,
      },
    });
  }
  //
  res.json({ result: true, status });
}

export default withApiSession(withHandlers({ methods: ['PATCH'], handler }));
