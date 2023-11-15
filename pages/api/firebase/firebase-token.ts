import withHandlers from '@/libs/server/withHandlers';
import { NextApiRequest, NextApiResponse } from 'next';

import { withApiSession } from '@/libs/server/withSession';
import client from '@/libs/server/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, device } = req.query;

  console.log(device);
  if (typeof token === 'string') {
    const base64Payload = token?.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
    const payload = Buffer.from(base64Payload, 'base64');
    const { user_id: uid, email } = JSON.parse(payload.toString());
    let user = await client?.user.findUnique({
      where: {
        firebaseUid: uid,
      },
    });

    if (!user) {
      // 1. email로 찾아보기
      const userByEmail = await client?.user.findUnique({
        where: {
          email,
        },
      });

      // 1-1. 없으면 생성
      if (!userByEmail) {
        user = await client?.user.create({
          data: {
            firebaseUid: uid,
            name: `anonymous_${Math.random().toString(36).substr(2, 11)}`,
            email,
          },
        });

        // 1-2. 있으면 업데이트
      } else {
        user = await client?.user.update({
          where: {
            id: userByEmail.id,
          },
          data: {
            firebaseUid: uid,
          },
        });
      }
    }

    // 없으면 종료
    if (!user) {
      return res.status(404).end();
    }

    // 사용자  디바이스  정보가 있을경우 update
    if (device && device !== 'null' && user.phone !== device) {
      await client?.user.update({
        where: {
          id: user.id,
        },
        data: {
          phone: device + "",
        },
      });
    }
    req.session.user = {
      id: user.id,
      token: token,
    };

    // 세션 저장.
    await req.session.save();

    return res.redirect(
      `/login/app?data=${btoa(
        JSON.stringify({
          id: user.id,
          token: token,
        }),
      )}`,
    );
  }
}

export default withApiSession(
  withHandlers({
    methods: ['GET'],
    handler,
    isPrivate: false,
  }),
);
