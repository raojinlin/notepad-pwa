import { NextRequest, NextResponse  } from "next/server";
import { decrypt, getUser } from "../../lib/session";
import { NextURL } from "next/dist/server/web/next-url";
import Auth from "../../lib/auth";



export const GET = async (req: NextRequest) => {
    const session = await getUser(req)
    if (!session || !session.userID) {
        return NextResponse.redirect(new NextURL('/login', req.url));
    }

    await new Auth().logout(session.userID, req.cookies.get('auth_id')?.value || '');
    const res = NextResponse.redirect(new NextURL('/login', req.url));
    res.cookies.delete('auth_id');
    return res;
}
