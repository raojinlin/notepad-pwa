import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import Auth from '../../../lib/auth';
import dayjs from "dayjs";

export const POST = async (req, res) => {
    const body = await req.json();
    if (!body.email || !body.password) {
        return new NextResponse("Invalid email or password", {status: 400});
    }

    const auth = new Auth();
    try {
        const session = await auth.login(body.email, body.password);
        const resp = new NextResponse(JSON.stringify(session), {status: 200});
        resp.cookies.set({
            name: 'auth_id',
            value: session.key,
            path: '/',
            expires: dayjs().add(24, 'hour').$d,
        });
        return resp;
    } catch (err) {
        return NextResponse.json({message: err.message, status: 404}, {status: 404});
    }
};