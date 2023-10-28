import { chatUrl } from '@/libs/client/url';
import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;

  const serverRes = await fetch(`${chatUrl}/api/rooms`, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });
  const json = await serverRes.json();

  const data = await client.chatroom.findMany({
    take: 20,
    skip: 0,
  });
  res.json({
    result: true,
    data,
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
