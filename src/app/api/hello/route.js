import { NextResponse } from "next/server";

export async function GET(req, res, next) {
  return new NextResponse("hello world!");
}
