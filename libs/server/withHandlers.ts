import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  result: boolean;
  [key: string]: any;
}

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandlers({
  methods,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as method)) {
      return res.status(405).end();
    }

    if (isPrivate && !req.session.firebaseUser?.uid) {
      return res
        .status(401)
        .json({ result: false, error: '로그인해야 합니다.' });
    }

    if (isPrivate && !req.session.user) {
      return res.status(401).json({ result: false, error: '인증해야 합니다.' });
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
