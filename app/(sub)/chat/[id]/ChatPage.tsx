"use client";

import classNames from "classnames";

export enum Role {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

interface ChatPageProps {
  prompt?: { icon: string; name: string };
  examples?: { role: Role; content: string }[];
  messages: { role: Role; content: string }[];
}

export function ChatPage({ examples, messages, prompt }: ChatPageProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <nav className="bg-white border-b dark:bg-gray-900">
        <div className="w-full flex items-center mx-auto p-4">
          <div className="flex-1 flex items-center justify-center gap-1">
            <div>{prompt?.icon || "💬"}</div>
            <div>{prompt?.name || "闲聊一下"}</div>
          </div>
        </div>
      </nav>
      <div className="flex-1 pt-3 px-2 flex flex-col-reverse overflow-y-auto overflow-x-hidden">
        <div className="flex-1"></div>

        {examples?.length && (
          <div className="w-full flex flex-col items-center gap-2">
            {examples.map(({ role, content }, inx) => (
              <div
                key={inx}
                className={classNames(
                  "w-full flex",
                  role === Role.ASSISTANT ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={classNames(
                    "p-2 rounded-md max-w-[90%]",
                    role === Role.ASSISTANT
                      ? "bg-black/5 text-gray-500"
                      : "bg-blue-600 text-white"
                  )}
                >
                  {content}
                </div>
              </div>
            ))}
            <div className="w-[80%] flex items-center text-gray-300 text-xs py-2">
              <div className="flex-1 h-[1px] bg-gradient-to-l from-black/10 via-black/5 to-black/0"></div>
              <div className="flex-1 text-center">以上为示例</div>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-black/10 via-black/5 to-black/0"></div>
            </div>
          </div>
        )}
      </div>
      <form className="pt-2">
        <label htmlFor="chat" className="sr-only">
          发送消息
        </label>
        <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700">
          <textarea
            id="chat"
            rows={1}
            className="block mx-2 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="发送消息..."
          ></textarea>
          <button
            type="submit"
            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
            <span className="sr-only">发送消息</span>
          </button>
        </div>
      </form>
    </div>
  );
}
