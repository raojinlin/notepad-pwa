import { NextResponse } from "next/server";
import { getExampleTable } from "../../../schema";


export async function GET(req, res, next) {
  await getExampleTable();
  return new NextResponse("hello world!");
}

export default function handler(req, res, next) {
  console.log('GET request');
  res.status(200).json({message: 'xHello World!'});
}