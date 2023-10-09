import mail from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/server/client';
import withHandlers, { ResponseType } from '@/libs/server/withHandlers';
import twilio from 'twilio';

mail.setApiKey(process.env.EMAIL_KEY as string);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// TWILIO_SID
// TWILIO_TOKEN
// TWILIO_SERVICE_ID
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = email ? { email } : phone ? { phone } : null;
  if (!user) {
    return res.json({ result: false });
  }

  const payload = Math.floor(Math.random() * 1000000) + '';

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: { ...user },
          create: {
            name: 'Anonymous',
            ...user,
          },
        },
      },
    },
  });

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_SERVICE_ID,
    //   to: process.env.TWILIO_PHONE as string,
    //   body: `너의 인증번호: ${payload}`,
    // });
    // console.log(message);
  } else if (email) {
    // const tempMail = await mail.send({
    //   from: 'minamhunmin@gmail.com',
    //   to: 'minamhunmin@gmail.com',
    //   subject: '화재장터에서 보낸 메일입니다',
    //   text: `너의 인증번호: ${payload}`,
    //   html: `
    //   <div>너의 인증번호: ${payload}</div>
    //   `,
    // });
    // console.log(tempMail);
  }
  return res.json({
    result: true,
  });
}

export default withHandlers({ methods: ['POST'], handler, isPrivate: false });
