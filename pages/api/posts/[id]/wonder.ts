import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyWonder = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +(id as string),
    },
  });

  if (alreadyWonder) {
    await client.wondering.delete({
      where: {
        id: alreadyWonder.id,
      },
    });
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +(id as string),
          },
        },
      },
    });
  }

  res.json({
    result: true,
  });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
