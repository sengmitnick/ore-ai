import gql from "graphql-tag";
import client from "@/lib/apollo-client";
import { ChatPage } from "./ChatPage";

const getData = async (id: string) => {
  const { data } = await client.query({
    query: gql`
      query ChatQuery($id: ID!) {
        chat(id: $id) {
          id
          prompt {
            name
            icon
            system
          }
          messages {
            role
            content
          }
          examples {
            role
            content
          }
        }
      }
    `,
    variables: { id },
  });
  return data;
};

export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: { id: string } }) {
  const {
    chat: { id, prompt, examples, messages },
  } = await getData(params.id);
  return (
    <ChatPage
      chatId={id}
      prompt={prompt}
      examples={examples}
      messages={messages}
    />
  );
}
