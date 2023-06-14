if (!process.env.API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export async function POST() {
  return new Response(process.env.API_KEY, { status: 200 });
}
