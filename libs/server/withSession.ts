import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
    firebaseUser?: {
      uid: string;
      email: string;
      displayName: string;
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
