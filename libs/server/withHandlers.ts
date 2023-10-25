import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  result: boolean;
  [key: string]: any;
}

type method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

function isLogin(req: NextApiRequest): boolean {
  return req.session.user?.id && req.session.user?.token ? true : false;
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

    if (isPrivate && !isLogin(req)) {
      return res
        .status(401)
        .json({ result: false, error: '로그인해야 합니다.' });
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
