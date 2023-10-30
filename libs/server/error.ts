import { NextApiResponse } from 'next';

export function errorNeedLogin(res: NextApiResponse) {
  res.json({
    result: false,
    message: '로그인이 필요합니다.',
  });
}
