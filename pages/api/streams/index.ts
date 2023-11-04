import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;

  if (req.method === 'GET') {
    const data = await client.stream.findMany({
      // take: 10,
      // skip: 10,
    });

    res.json({
      result: true,
      data,
    });
  } else if (req.method === 'POST') {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STREAM_TOKEN}`,
        },
        body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10 }}`,
      },
    );

    console.log(response);
    const json = await response.json();

    const { uid, rtmps } = json.result;

    const data = await client.stream.create({
      data: {
        cloudStreamId: uid,
        cloudStreamKey: rtmps.streamKey,
        cloudStreamUrl: rtmps.url,
        name,
        price: Number(price.replace(/,/g, '')),
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      result: true,
      data: {
        id: data.id,
        ...json.result,
      },
    });
  }
}

export default withApiSession(withHandlers({ methods: ['GET', 'POST'], handler }));
