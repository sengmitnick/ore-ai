"use client";

import { Fragment } from "react";
import gql from "graphql-tag";
import client from "@/lib/apollo-client";

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

export default async function Home({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    chat: { prompt, examples, messages },
  } = await getData(id);
  return (
    <Fragment>
      <nav className="bg-white border-b dark:bg-gray-900">
        <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
          {prompt.icon}
          {prompt.name}
        </div>
      </nav>
    </Fragment>
  );
}
