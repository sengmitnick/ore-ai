"use client";

import { Fragment } from "react";
import gql from "graphql-tag";
import client from "@/lib/apollo-client";
import { Category } from "./Category";

const getData = async () => {
  const { data } = await client.query({
    query: gql`
      query CategoryQuery {
        allCategory {
          id
          name
        }
      }
    `,
  });
  return data;
};

export default async function Home() {
  const data = await getData();
  return (
    <Fragment>
      <nav className="sticky top-0 bg-white dark:bg-gray-900">
        <div className="w-full h-14 border-b flex flex-wrap items-center justify-between mx-auto px-4">
          发现
        </div>
      </nav>

      <Category data={[{ id: "all", name: "全部" }, ...data.allCategory]} />
    </Fragment>
  );
}
