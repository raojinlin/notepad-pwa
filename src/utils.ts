import { NextRequest } from "next/server";

export const bodyParser = async (request: NextRequest) => {
  const reader = request.body.getReader();
  let body = await reader.read().then(({ done, value }) => {
    return new TextDecoder().decode(value);
  });

  return JSON.parse(body);
}


export const randomID = (len: number): string => {
    let id = '';
    let letters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345789`;
    for (let i = 0; i < len; i++) {
        id += letters.charAt(Math.floor(Math.random() *100) % letters.length);
    }

    return id;
}