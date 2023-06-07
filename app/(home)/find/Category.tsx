"use client";

import classNames from "classnames";
import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { PromptList } from "./PromptList";

const CategoryQuery = gql`
  query CategoryQuery($id: ID!) {
    category(id: $id) {
      prompts {
        id
        name
        icon
        system
      }
    }
  }
`;

const PromptQuery = gql`
  query PromptQuery {
    prompt {
      id
      name
      icon
      system
    }
  }
`;

interface CategoryTabProps {
  data: { id: string; name: string }[];
}

const CategoryPrompt = ({ id }: { id: string }) => {
  const { loading, error, data } = useQuery(CategoryQuery, {
    variables: { id },
  });

  if (loading) return <>Loading...</>;
  if (error) return <>{`Error! ${error.message}`}</>;

  return <PromptList list={data.category.prompts} />;
};

const AllPrompt = () => {
  const { loading, error, data } = useQuery(PromptQuery);

  if (loading) return <>Loading...</>;
  if (error) return <>{`Error! ${error.message}`}</>;

  return <PromptList list={data.prompt} />;
};

export const Category = ({ data }: CategoryTabProps) => {
  const [activeKey, setActiveKey] = useState("all");

  return (
    <>
      <div className="p-3 w-full overflow-auto text-gray-500 dark:text-gray-400">
        <ul className="flex text-sm font-medium text-center">
          {data.map(({ id, name }) => (
            <li className="flex-none mr-2 last:mr-0" key={id}>
              <span
                className={classNames(
                  "inline-block px-4 py-3 rounded-lg cursor-pointer",
                  activeKey === id
                    ? "text-white bg-blue-600 "
                    : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                )}
                onClick={() => setActiveKey(id)}
              >
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {activeKey === "all" ? <AllPrompt /> : <CategoryPrompt id={activeKey} />}
    </>
  );
};
