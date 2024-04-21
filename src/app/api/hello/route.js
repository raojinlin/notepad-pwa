import { label, Middleware } from "next-api-middleware";
import { NextResponse } from "next/server";


const middleware = async (req, res, next) => {
  console.log('middleware started')
  await next();
  console.log('middleware ended')
}

const withMiddleware = label({middleware}, ['middleware'])

// export const GET = withMiddleware(async (req, res, next) => {
//   console.log('GET request')
//   res.json({
//     message: 'Hello World!'
//   })
// })

// export default function handler(req, res, next) {
//   res.json({message: 'Hello World!'});
// }

export async function GET(req, res, next) {
  return new NextResponse("hello world!");
}

export default function handler(req, res, next) {
  console.log('GET request');
  res.status(200).json({message: 'xHello World!'});
}