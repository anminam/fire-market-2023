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

  if (!session?.firebaseUser?.uid && !req.url.includes('/login')) {
    const url = req.nextUrl.clone();
    url.searchParams.set('from', url.pathname);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // if (
  //   !session.user &&
  //   !req.url.includes('/join') &&
  //   !req.url.includes('/login')
  // ) {
  //   const url = req.nextUrl.clone();
  //   url.searchParams.set('from', url.pathname);
  //   url.pathname = '/join';
  //   return NextResponse.redirect(url);
  // }
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
