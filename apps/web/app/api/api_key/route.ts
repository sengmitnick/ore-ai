import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ key: process.env.API_KEY });
}
