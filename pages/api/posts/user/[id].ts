import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { id },
  } = req;

  // id 가없으면 에러
  if (!id) {
    res.status(400).json({
      result: false,
      message: 'id 가 없습니다.',
    });
    return;
  }

  const data = await client.post.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    where: {
      userId: +id?.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          Answers: true,
          Wonderings: true,
        },
      },
    },
  });

  console.log(data);

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
