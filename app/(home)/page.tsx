import { Fragment } from "react";
import { ChatList } from "./ChatList";

export default function Page() {
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
