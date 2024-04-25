import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { createEdgeRouter } from "next-connect";
import { decrypt } from './lib/session';
import dayjs from 'dayjs';
import { NextURL } from 'next/dist/server/web/next-url';

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

const noAuthUrl = ['/api/login', '/api/register', {url: '/api/share', method: 'GET'}];

const isAuthenticated = async (req: NextRequest) => {
  if (req.url.includes('/api/login') || req.url.includes('/api/register')) {
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

// async function auth_middleware(req: NextRequest, context: NextPageContext) {
//   if (['/api/login', '/api/register'].some(url => req.url.includes(url))) {
//     return NextResponse.next();
//   }

//   const authID = req.cookies.get('auth_id')
//   if (!authID || !authID.value) {
//     const url = req.nextUrl.clone();
//     url.pathname = '/login';
//     return NextResponse.redirect(url);
//   }

//   const user = new User();
//   const loginUser = await user.getLoginUser(authID.value)

//   const headers = new Headers(req.headers);
//   headers.set('x-session-user', loginUser)
//   console.log('auth_middleware', loginUser);
//   return NextResponse.next({request: {headers: headers}});
// }


// export async function middleware(request: NextRequest, context: NextPageContext) {
//   if (request.url.includes('/api')) {
//     console.log("api request: ", new Date(), request.url)
//     await db.select().from(UserTable);
//     // return auth_middleware(request, context)
//   }
// }
   
// export const config = {
//   matcher: '/(api/.*)',
// }