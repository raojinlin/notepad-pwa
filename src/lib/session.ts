import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(authID: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(authID, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}



export async function getUserByAuthID(authID: string) {
  const session = await decrypt(authID);

  if (!session?.userID) {
    return {isAuth: false, userID: 0};
  }

  return {isAuth: true, userID: session.userID};
}

export async function getUser(req: NextRequest) {
  return await getUserByAuthID(req.cookies.get('auth_id')?.value);
}
