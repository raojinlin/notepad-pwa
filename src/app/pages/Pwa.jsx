"use client"

import { useEffect } from "react";

export default function Pwa() {
  let sw;
  if (typeof window !== "undefined") {
    sw = window?.navigator?.serviceWorker;
  }

  useEffect(() => {
    if (sw) {
      sw.register("/sw.js", { scope: "/" }).then((registration) => {
        console.log("Service Worker registration successful with scope: ", registration.scope);
      }).catch((err) => {
        console.log("Service Worker registration failed: ", err);
      });
    }
  }, [sw]);

  return (
    <></>
  )
}
