"use client";

import gql from "graphql-tag";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Token } from "@/utils";
import Link, { LinkProps } from "next/link";
import classNames from "classnames";
import { Result, Skeleton } from "@/components";

const ChatQuery = gql`
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

interface ChatInfoProps {
  top?: boolean;
  href: LinkProps["href"];
  prompt: { icon: string; name: string };
}

const ChatInfo = ({ top, href, prompt }: ChatInfoProps) => {
  return (
    <Link
      className={classNames(
        "w-full pl-3 flex items-center last:border-transparent",
        top ? "bg-black/10 hover:bg-black/20" : "bg-black/5 hover:bg-black/10"
      )}
      href={href}
    >
      <div className="flex-none">{prompt.icon}</div>
      <div className="ml-2 py-2 pr-3 flex-1 flex items-center border-b-[0.5px] border-black/5">
        <div className="flex-1 truncate">{prompt.name}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 flex-none text-black/10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </Link>
  );
};

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

  if (loading || spinning) return <Skeleton />;
  if (error)
    return <Result status="error" title="Error!" desc={error.message} />;

  const chats = data.chatMany as any[];
  return (
    <div className="w-full">
      {chats.map(({ id, prompt }) => {
        return prompt ? (
          <ChatInfo key={id} href={`/chat/${id}`} prompt={prompt} />
        ) : (
          <ChatInfo
            top
            key={id}
            href={`/chat/${id}`}
            prompt={{ icon: "💬", name: "闲聊一下" }}
          />
        );
      })}
    </div>
  );
};
