import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  basePath: `${process.env.NEXT_PUBLIC_API_URL}`,
  apiKey: `${process.env.NEXT_PUBLIC_API_KEY}`,
});

const openai = new OpenAIApi(configuration);

export const POST = async (request: Request) => {
  try {
    const messages = await request.json();
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    const choice = completion.data.choices[0];
    console.log(choice.message?.content);
    return NextResponse.json({
      message: choice.message,
      finish_reason: choice.finish_reason,
      usage: completion.data.usage,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
