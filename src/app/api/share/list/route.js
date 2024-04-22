import { NextPageContext } from "next";
import { db, NotepadTable, NoteShareTable } from "../../../../schema";
import { NextResponse } from "next/server";
import { count, desc, eq, inArray } from "drizzle-orm";
import groupBy from 'loadsh/groupBy'


export const GET = async (req, context) => {
    const params = new URL(req.url).searchParams;
    console.log(params);
    const pageIndex = Number(params.get('pageIndex')) || 1; 
    const pageSize = Number(params.get('pageSize')) || 10;
    const items = await db.select().from(NoteShareTable).limit(pageSize).offset((pageIndex-1)*pageSize).orderBy(desc(NoteShareTable.createdAt))
    const total = await db.select({total: count(NoteShareTable.sid)}).from(NoteShareTable)
    const noteIDs = items.map(it => it.noteID);
    const notes = groupBy(await db.select({
        id: NotepadTable.id, 
        noteID: NotepadTable.noteID, 
        name: NotepadTable.name, 
        createdAt: NotepadTable.createdAt
    }).from(NotepadTable).where(inArray(NotepadTable.noteID, noteIDs)), 'noteID');

    items.forEach((it) => {
        it.notes = notes[it.noteID] || [];
    });

    return new NextResponse(JSON.stringify({items, total: total[0].total}), {headers: {'Content-Type': 'application/json'}});
}