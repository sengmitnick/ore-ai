"use client";

import { Fragment } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Result, Skeleton } from "@/components";
import { Category } from "./Category";

const CategoryQuery = gql`
query CategoryQuery {
  allCategory {
    id
    name
  }
}
`

export default function Page() {
  const { loading, error, data } = useQuery(CategoryQuery);
  if (loading) return <Skeleton />;
  if (error)
    return <Result status="error" title="Error!" desc={error.message} />;
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
