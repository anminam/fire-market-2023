import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method === 'GET') {
  //   const { user } = req.session;
  //   const chat = await client.chat.findUnique({
  //     where: {
  //       id: Number(req.query.id),
  //     },
  //   });
  //   // 없으면 종료.
  //   if (!chat || !user) {
  //     res.json({
  //       result: false,
  //       data: null,
  //     });
  //     return;
  //   }
  //   const { sellingUserId, buyingUserId } = chat;
  //   const userIds = [sellingUserId, buyingUserId];
  //   if (!userIds.includes(user.id)) {
  //     res.json({
  //       result: false,
  //       data: null,
  //     });
  //     return;
  //   }
  //   res.json({
  //     result: true,
  //     data: chat,
  //   });
  //   return;
  // }
  // if (req.method === 'POST') {
  //   const {
  //     body: { productId, sellingId },
  //     session: { user },
  //   } = req;
  //   const findChat = await client.chat.findFirst({
  //     where: {
  //       productId: Number(productId),
  //       sellingUserId: Number(sellingId),
  //       buyingUserId: Number(user?.id),
  //     },
  //   });
  //   // 찾았으면 그걸줌.
  //   if (findChat) {
  //     res.json({
  //       result: true,
  //       data: findChat,
  //     });
  //     return;
  //   }
  //   const resData = await client.chat.create({
  //     data: {
  //       product: {
  //         connect: {
  //           id: productId,
  //         },
  //       },
  //       sellingUser: {
  //         connect: {
  //           id: sellingId,
  //         },
  //       },
  //       buyingUser: {
  //         connect: {
  //           id: user?.id,
  //         },
  //       },
  //     },
  //   });
  //   res.json({
  //     result: true,
  //     data: resData,
  //   });
  // }
}

export default withApiSession(
  withHandlers({ methods: ['POST', 'GET'], handler })
);
