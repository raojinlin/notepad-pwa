import { NextRequest, NextResponse } from "next/server";
import { db, NoteShareTable, NotepadTable } from "../../../../schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import _ from 'lodash';

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

  const notes = await db.select().from(NotepadTable)
    .where(and(eq(NotepadTable.noteID, share.noteID), eq(NotepadTable.userID, share.userID)));
  if (notes.length === 0) {
    return new NextResponse('not found', {status: 404});
  }

  await db.update(NoteShareTable).set({accessCount: share.accessCount+1}).where(eq(NoteShareTable.sid, share.sid))
  return NextResponse.json({..._.omit(share, 'userID'), note: _.omit(notes[0], 'userID')});
} 