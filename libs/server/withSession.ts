import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      token: string;
    };
  }
}

const option = {
  cookieName: process.env.COOKIE_NAME!,
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(handler: any) {
  return withIronSessionApiRoute(handler, option);
}

export function withSSRSession(handler: any) {
  return withIronSessionSsr(handler, option);
}
