if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export async function POST() {
  return new Response(process.env.OPENAI_API_KEY, { status: 200 });
}
