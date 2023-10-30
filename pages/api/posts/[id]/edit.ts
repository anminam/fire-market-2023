import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { question, lat, lng, id },
  } = req;

  const post = await client.post.update({
    where: {
      id: +id,
    },
    data: {
      question,
      latitude: lat,
      longitude: lng,
    },
  });

  res.json({
    result: true,
    data: post,
  });
}

export default withApiSession(withHandlers({ methods: ['PATCH'], handler }));
