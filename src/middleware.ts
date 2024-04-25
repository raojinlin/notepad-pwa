import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { createEdgeRouter } from "next-connect";
import { decrypt } from './lib/session';
import dayjs from 'dayjs';

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

const noAuthCheckUrls = ['/api/login', '/api/share/note', '/api/register'];

const isAuthenticated = async (req: NextRequest) => {
  if (noAuthCheckUrls.some(url => req.url.includes(url))) {
    if (req.url.includes('/api/register')) {
      return process.env.ALLOW_USER_REGISTER === 'true';
    }
    return true;
  }

  const authID = req.cookies.get('auth_id');
  if (!authID || !authID.value) return false;

  const session = await decrypt(authID.value);
  if (!session || !session.userID) {
    return false;
  }

  const { expiredAt } = session;
  if (!expiredAt) {
    return false;
  }
    
  if (dayjs(expiredAt as string).diff(dayjs()) <= 0) {
    return false;
  }

    return true;
}

router.use('/api/.*', async (req: NextRequest) => {
  console.log(dayjs().format(), req.method, req.url);
  if (!await isAuthenticated(req)) {
    return NextResponse.json({message: 'Authentication failed'}, {status: 401});
  }

  return NextResponse.next();
})

router.use('/api/register', () => {
  if (!process.env.ALLOW_USER_REGISTER) {
    return NextResponse.json({message: 'Authentication failed'}, {status: 401});
  }

  return NextResponse.next();
});

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  return router.run(request, event);
}

export const config = {
  matcher: ['/((?:api.+$).*)'],
}