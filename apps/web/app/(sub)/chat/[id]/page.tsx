import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Result, Skeleton } from "@/components";
import { useParams } from "next/navigation";
import { ChatPage } from "./ChatPage";

const ChatQuery = gql`
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
`
export default async function Page() {
  const params = useParams()
  const { loading, error, data } = useQuery(ChatQuery, {variables: {id: params.id}});
  
  if (loading) return <Skeleton />;
  if (error)
    return <Result status="error" title="Error!" desc={error.message} />;
  const {
    chat: { id, prompt, examples, messages },
  } = data;
  return (
    <ChatPage
      chatId={id}
      prompt={prompt}
      examples={examples}
      messages={messages}
    />
  );
}
