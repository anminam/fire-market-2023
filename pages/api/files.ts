import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.IMAGE_UPLOAD_TOKEN}`,
        },
      }
    )
  ).json();

  res.json({
    result: true,
    data: {
      ...response.result,
    },
  });
}

export default withApiSession(withHandlers({ methods: ['GET'], handler }));
