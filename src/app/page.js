import React from "react";
import Notepad from "./components/Notepad";
import { getUserByAuthID } from "../lib/session";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'



export default async function Home() {
  const user = await getUserByAuthID(cookies().get('auth_id')?.value);
  if (!user.isAuth) {
    redirect('/login');
  }
  return (
    <main>
      <div>
        <Notepad />
      </div>
    </main>
  )
}
