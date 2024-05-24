import { NextPageContext } from "next";
import { NextRequest, NextResponse } from "next/server";
import Auth, { UserAlreadyExistsError } from '../../../lib/auth';


export const POST = async (req: NextRequest, context: NextPageContext) => {
    const body = await req.json();
    if (!body.name || !body.email || !body.password) {
        return new NextResponse('Invalid payload', {status: 400});
    }

    const auth = new Auth();
    try {
        const r = await auth.register(body.name, body.email, body.password);
        return NextResponse.json(r, {status: 200});
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return NextResponse.json({message: 'user already exists', status: 400}, {status: 400});
        }

        return NextResponse.json({message: err.message}, {status: 500});
    }
}