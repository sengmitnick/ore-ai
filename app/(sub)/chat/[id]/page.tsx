"use client";

import { Fragment } from "react";
import gql from "graphql-tag";
import client from "@/lib/apollo-client";
import { ChatPage } from "./ChatPage";

const getData = async (id: string) => {
  const { data } = await client.query({
    query: gql`
      query ChatQuery($id: ID!) {
        chat(id: $id) {
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

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    chat: { prompt, examples, messages },
  } = await getData(id);
  return <ChatPage prompt={prompt} examples={examples} messages={messages} />;
}
