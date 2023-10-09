import { getIronSession } from 'iron-session/edge';
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (userAgent(req).isBot) {
    return new Response('Hello bot!', { status: 403 });
  }

  const res = NextResponse.next();

  const session = await getIronSession(req, res, {
    cookieName: process.env.COOKIE_NAME!,
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV! === 'production',
    },
  });

  console.log(session);
  if (!session.user && !req.url.includes('/join')) {
    req.nextUrl.searchParams.set('from', req.nextUrl.pathname);
    req.nextUrl.pathname = '/join';
    return NextResponse.redirect(new URL(req.nextUrl, req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
