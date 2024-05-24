const process = require('process');

import { and, eq } from 'drizzle-orm';
import { db, NotepadTable } from '../../../schema';
import { getUser } from '../../../lib/session';


export async function GET(request, context) {
  const user = await getUser(request);
  const r = await db.select().from(NotepadTable).where(eq(NotepadTable.userID, user.userID))
  return new Response(JSON.stringify(r), {headers: {'content-type': 'application/json'}});
}

export async function POST(request, context) {
  const user = await getUser(request);
  const body = await request.json();
  const insertData = {name: body.name, userID: user.userID, content: body.content, noteID: body.noteID};

  const r = await db.insert(NotepadTable)
    .values(insertData)
    .onConflictDoUpdate({
      target: NotepadTable.noteID,
      set: {'name': insertData.name, 'content': insertData.content, 'updatedAt': new Date(), 'userID': insertData.userID}
    }).returning();
  return new Response(JSON.stringify(r));
}

export async function DELETE(request) {
  const user = await getUser(request);
  const noteID = new URL(request.url).searchParams.get('noteID');
  if (!noteID) {
    return new Response('Bad Request', {status: 400});
  }


  const r = await db.delete(NotepadTable).where(and(eq(NotepadTable.noteID, noteID), eq(NotepadTable.userID, user.userID))).returning();
  return new Response(JSON.stringify(r), {headers: {'content-type': 'application/json'}});
}
