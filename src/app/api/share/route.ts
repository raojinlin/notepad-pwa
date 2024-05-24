import { NextResponse } from "next/server"
import { randomID } from "../../../utils";
import { db, NoteShareTable } from "../../../schema";
import { NextRequest } from "next/server";
import { NextPageContext } from "next";
import { and, eq } from "drizzle-orm";
import { getUser } from "../../../lib/session";


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
  const r = await db.delete(NoteShareTable).where(and(eq(NoteShareTable.userID, user.userID as number), eq(NoteShareTable.sid, sid))).returning();
  return NextResponse.json(r)
}