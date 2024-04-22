import { NextResponse } from "next/server"
import { randomID } from "../../../utils";
import { db, NotepadTable, NoteShareTable } from "../../../schema";
import { NextRequest } from "next/server";
import { NextPageContext } from "next";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

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

  const notes = await db.select().from(NotepadTable).where(eq(NotepadTable.noteID, share.noteID))
  if (notes.length === 0) {
    return new NextResponse('not found', {status: 404});
  }

  await db.update(NoteShareTable).set({accessCount: share.accessCount+1}).where(eq(NoteShareTable.sid, share.sid))
  return new NextResponse(JSON.stringify({...share, note: notes[0]}), {headers: {'Content-Type': 'application/json'}});
} 


export const POST = async (req: NextRequest, context: NextPageContext) => {
  const body = await req.json(); 
  const insertData = {
    expiredAt: body.expiredAt ? new Date(body.expiredAt*1000) : null,
    public: body.public,
    password: body.password,
    noteID: body.noteID,
    userID: 0,
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
  return new NextResponse(JSON.stringify(r), {headers: {'Content-Type': 'application/json'}});
}

export const DELETE = async (req: NextRequest, context: NextPageContext) => {
  const sid = new URL(req.url).searchParams.get('sid')
  if (!sid || !sid.trim()) {
    return new NextResponse('not found', {status: 404});
  }

  const r = await db.delete(NoteShareTable).where(eq(NoteShareTable.sid, sid)).returning();
  return new NextResponse(JSON.stringify(r), {headers: {'Content-Type': 'application/json'}});
}