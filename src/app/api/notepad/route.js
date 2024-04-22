const process = require('process');

import { eq } from 'drizzle-orm';
import { db, NotepadTable } from '../../../schema';
import { bodyParser } from '../../../utils';


export async function GET(request, context) {
  const r = await db.select().from(NotepadTable).where(eq(NotepadTable.userID, 0))
  return new Response(JSON.stringify(r), {headers: {'content-type': 'application/json'}});
}

export async function POST(request, context) {
  const body = await bodyParser(request);
  const insertData = {name: body.name, userID: 0, content: body.note, noteID: body.noteID};
  
  const r = await db.insert(NotepadTable)
    .values(insertData)
    .onConflictDoUpdate({
      target: NotepadTable.noteID, 
      set: {'name': insertData.name, 'content': insertData.content, 'updatedAt': new Date()}
    }).returning();
  return new Response(JSON.stringify(r));
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return new Response('Bad Request', {status: 400});
  }


  const r = await db.delete(NotepadTable).where(eq(NotepadTable.id, id)).returning();
  return new Response(JSON.stringify(r), {headers: {'content-type': 'application/json'}});
}
