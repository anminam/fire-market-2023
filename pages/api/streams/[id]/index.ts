import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const data = await client.stream.findUnique({
    where: {
      id: +(id as string),
    },
    include: {
      StreamMessage: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              avatar: true,
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
    },
  });

  const isOwner = data?.userId === user?.id;

  if (data && !isOwner) {
    data.cloudStreamUrl = '';
    data.cloudStreamKey = '';
  }

  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
