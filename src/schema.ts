import {
  pgTable,
  serial,
  boolean,
  text,
  timestamp,
  uniqueIndex,
  json,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';


import { sql } from "@vercel/postgres";

export const db = drizzle(sql);

export const UserTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    password: varchar('passowrd').notNull(),
    email: text('email').notNull(),
    image: text('image').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  },
);

export const UserSession = pgTable('nt_sessions', {
  id: serial('id').primaryKey(),
  userID: integer('userID').notNull(),
  key: text('name').notNull(),
  expiredAt: timestamp('expiredAt').notNull(),
  data: json('data').notNull(),
  createdAt: timestamp('createdAt').notNull(),
}, (session) => {
  return {
    uniqueIndex: uniqueIndex('user_session_idx').on(session.userID)
  }
})

export const NotepadTable = pgTable('nt_notepad', {
  id: serial('id').primaryKey(),
  userID: serial('userID').notNull(),
  noteID: text('noteID').default(''),
  name: text('name').notNull(),
  content: text('content'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (notepad) => {
  return {
    uniqueIdx: uniqueIndex('unique_note').on(notepad.noteID)
  }
});

export const TagsTable = pgTable('nt_tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  userID: serial('userID').notNull(),
  content: text('content').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (tags) => {
  return {
    uniqueIndex: uniqueIndex('user_tag_idx').on(tags.userID, tags.name)
  }
})

export const NoteTagRelationshipTable = pgTable('nt_note_tags', {
  id: serial('id').primaryKey(),
  userID: serial('userID').notNull(),
  tagID: serial('tagID').notNull(),
  noteID: serial('noteID').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (relation) => {
  return {
    uniqueIndex: uniqueIndex('user_tag_note_idx').on(relation.userID, relation.tagID, relation.noteID),
  }
});

export const NoteShareTable = pgTable('nt_note_share', {
  id: serial('id').primaryKey(),
  sid: text('sid').notNull(),
  userID: serial('userID').notNull(),
  noteID: text('noteID').notNull(),
  password: text('password').default(''),
  public: boolean('public').default(false), 
  accessCount: serial('accessCount'),
  expiredAt: timestamp('expiredAt').default(null),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (share) => {
  return {
    uniqueIndex: uniqueIndex('user_share_idx').on(share.sid)
  }
})

export const getExampleTable = async () => {
  const selectResult = await db.select().from(UserTable);
  console.log('Results', selectResult);
};