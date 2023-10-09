import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // const productID = +(id as string);
  const product = await client.product.findUnique({
    where: {
      id: +(id as string),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const isLike = Boolean(
    await client.favorite.findFirst({
      where: {
        productId: +(id as string),
        userId: req.session.user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  //
  res.json({
    result: true,
    product,
    isLike,
    relatedProducts,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
