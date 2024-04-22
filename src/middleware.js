import { NextResponse } from 'next/server';

export function middleware(request, context) {
  console.log(new Date(), request.url)
  if (request.url.includes('/api/hello')) {
    // return new NextResponse('/api/hello');
  }
}
   
// export const config = {
//   matcher: '/api/hello',
// }