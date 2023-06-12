import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";

if (!process.env.NEXT_PUBLIC_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export async function POST(req: Request): Promise<Response> {
  const { messages } = (await req.json()) as {
    messages?: any[];
  };

  if (!messages) {
    return new Response("No messages in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
