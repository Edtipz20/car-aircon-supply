import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const response = NextResponse.next();

  if (!req.cookies.get("sessionCartId")) {
    response.cookies.set("sessionCartId", uuidv4());
  }

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
