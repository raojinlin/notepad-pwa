import { db, NotepadTable, NoteShareTable } from "../../../../schema";
import { NextResponse } from "next/server";
import { count, desc, eq, inArray, and } from "drizzle-orm";
import { getUser } from "../../../../lib/session";

import groupBy from 'loadsh/groupBy'


export const GET = async (req, context) => {
  const params = new URL(req.url).searchParams;
  const pageIndex = Number(params.get('pageIndex')) || 1;
  const pageSize = Number(params.get('pageSize')) || 10;
  const user = await getUser(req);
  const items = await db.select().from(NoteShareTable)
    .where(eq(NoteShareTable.userID, user.userID))
    .limit(pageSize)
    .offset((pageIndex - 1) * pageSize)
    .orderBy(desc(NoteShareTable.createdAt));
  const total = await db.select({ total: count(NoteShareTable.sid) })
    .from(NoteShareTable)
    .where(eq(NoteShareTable.userID, user.userID))
  const noteIDs = items.map(it => it.noteID);
  if (!noteIDs.length) {
    return NextResponse.json({items: [], total: 0});
  }

  const notes = groupBy(await db.select({
    id: NotepadTable.id,
    noteID: NotepadTable.noteID,
    name: NotepadTable.name,
    createdAt: NotepadTable.createdAt
  }).from(NotepadTable).where(and(eq(NotepadTable.userID, user.userID)), inArray(NotepadTable.noteID, noteIDs)), 'noteID');

  items.forEach((it) => {
    it.notes = notes[it.noteID] || [];
  });

  return NextResponse.json({ items, total: total[0].total });
}