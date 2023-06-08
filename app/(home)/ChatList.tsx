"use client";

import gql from "graphql-tag";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Token } from "@/utils";

export const ChatQuery = gql`
  query ChatQuery($userId: ID!) {
    chatMany(userId: $userId) {
      id
      prompt {
        icon
        name
      }
    }
  }
`;

export const ChatList = () => {
  const router = useRouter();
  const [spinning, setSpinning] = useState(true);
  const [run, { data, loading, error }] = useLazyQuery(ChatQuery);
  useEffect(() => {
    let userId: string | null = null;
    if (Token.isSignIn) {
      userId = Token.token;
    }

    if (!userId) {
      router.replace("/login");
      return;
    }
    run({ variables: { userId } });
    setSpinning(false);
  }, []);

  if (loading || spinning) return <>Loading...</>;
  if (error) return <>{`Error! ${error.message}`}</>;

  const chats = data.chatMany as any[];
  return (
    <div>
      {chats.map(({ id, prompt }) => {
        return (
          <div key={id} className="flex items-end">
            <div>{prompt.icon}</div>
            <div>{prompt.name}</div>
          </div>
        );
      })}
    </div>
  );
};
