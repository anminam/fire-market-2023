import client from '@/libs/server/client';
import withHandlers from '@/libs/server/withHandlers';
import { withApiSession } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { phone, email, name, avatarId },
  } = req;

  const currentUser = await client.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (email && currentUser?.email !== email) {
    const alreadyExist = Boolean(
      await client.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      })
    );

    if (alreadyExist) {
      res.json({
        result: false,
        error: '이미 존재하는 이메일입니다.',
      });
      return;
    }

    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        email,
      },
    });
  }

  if (phone && currentUser?.phone !== phone) {
    const alreadyExist = Boolean(
      await client.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        },
      })
    );

    if (alreadyExist) {
      res.json({
        result: false,
        error: '이미 존재하는 전화번호입니다.',
      });
      return;
    }

    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        phone,
      },
    });
  }

  if (name && currentUser?.name !== name) {
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name,
      },
    });
  }

  if (avatarId) {
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        avatar: avatarId,
      },
    });
  }

  return res.json({
    result: true,
  });
}

export default withApiSession(withHandlers({ methods: ['POST'], handler }));
