"use client";

import { Fragment } from "react";
import client from "@/lib/apollo-client";
import { SignupMutation, UserQuery } from "@/graphql";
import { ChatList } from "./ChatList";

export default function Home() {
  return (
    <Fragment>
      <nav className="bg-white border-b dark:bg-gray-900">
        <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
          对话
        </div>
      </nav>
      <ChatList />
    </Fragment>
  );
}
