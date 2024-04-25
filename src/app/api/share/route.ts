import { NextResponse } from "next/server"
import { randomID } from "../../../utils";
import { db, NotepadTable, NoteShareTable } from "../../../schema";
import { NextRequest } from "next/server";
import { NextPageContext } from "next";
import { and, eq } from "drizzle-orm";
import dayjs from "dayjs";
import { getUser } from "../../../lib/session";

export const GET = async (req: NextRequest, context) => {
  const params = new URL(req.url).searchParams
  const sid = params.get('sid');
  const password = params.get('password');

  if (!sid) {
    return new NextResponse('Not found', {status: 404});
  }

  const items = await db.select().from(NoteShareTable).where(eq(NoteShareTable.sid, sid));
  if (!items.length) {
    return new NextResponse('Not found', {status: 404});
  }

  const share = items[0]
  if (!share.public && share.password !== password) {
    return new NextResponse('access denied', {status: 403});
  }

  if (share.expiredAt && dayjs(share.expiredAt).diff(dayjs()) <= 0) {
    return new NextResponse('share expired', {status: 403});
  }

  const notes = await db.select().from(NotepadTable).where(and(eq(NotepadTable.noteID, share.noteID), eq(NotepadTable.userID, share.userID)));
  if (notes.length === 0) {
    return new NextResponse('not found', {status: 404});
  }

  await db.update(NoteShareTable).set({accessCount: share.accessCount+1}).where(eq(NoteShareTable.sid, share.sid))
  return NextResponse.json({...share, note: notes[0]});
} 


export const POST = async (req: NextRequest, context: NextPageContext) => {
  const body = await req.json(); 
  const user = await getUser(req);
  const insertData = {
    expiredAt: body.expiredAt ? new Date(body.expiredAt*1000) : null,
    public: body.public,
    password: body.password,
    noteID: body.noteID,
    userID: user.userID as number,
    accessCount: 0,
    sid: body.sid
  };

  if (!body.sid) {
    insertData.sid = randomID(11);
  }

  const r = await db
    .insert(NoteShareTable)
    .values(insertData)
    .onConflictDoUpdate({
        target: NoteShareTable.sid, 
        set: {
          password: insertData.password, 
          public: insertData.public, 
          expiredAt: insertData.expiredAt,
          updatedAt: new Date(),
        }
    }).returning()
  return NextResponse.json(r);
}

export const DELETE = async (req: NextRequest, context: NextPageContext) => {
  const sid = new URL(req.url).searchParams.get('sid')
  if (!sid || !sid.trim()) {
    return new NextResponse('not found', {status: 404});
  }
  const user = await getUser(req);
  const r = await db.delete(NoteShareTable).where(and(eq(NoteShareTable.userID, user.userID), eq(NoteShareTable.sid, sid))).returning();
  return NextResponse.json(r)
}