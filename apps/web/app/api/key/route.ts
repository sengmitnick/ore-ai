import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  return NextResponse.json({ key: process.env.API_KEY });
}
