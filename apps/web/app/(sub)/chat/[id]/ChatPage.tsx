"use client";

import { formDataToObject } from "@/utils";
import { useGetState, useMount } from "ahooks";
import classNames from "classnames";
import { useMutation } from "@apollo/client";
import { FormEventHandler, useRef, useState } from "react";
import { Dropdown } from "flowbite";
import type { DropdownOptions, DropdownInterface } from "flowbite";
import gql from "graphql-tag";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchSSE } from "@/utils/fetch-sse";
import { fetch } from "@/utils/fetch";

const MessageMutation = gql`
  mutation MessageMutation($role: Role!, $content: String!, $chatId: ID!) {
    message(role: $role, content: $content, chatId: $chatId) {
      id
    }
  }
`;

const CleanMessageMutation = gql`
  mutation CleanMessageMutation($chatId: ID!) {
    cleanMessage(chatId: $chatId) {
      id
    }
  }
`;

export enum Role {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  SYSTEM = "SYSTEM",
}

interface ChatPageProps {
  chatId: string;
  prompt?: { icon: string; name: string; system: string };
  examples?: { role: Role; content: string }[];
  messages: { role: Role; content: string; error?: boolean }[];
}

export function ChatPage({
  chatId,
  examples,
  messages,
  prompt,
}: ChatPageProps) {
  const router = useRouter();
  const search = useSearchParams();
  const dropdownRef = useRef<DropdownInterface>();
  const controllerRef = useRef<AbortController>();

  const [input, setInput] = useState("");
  const [list, update] = useState(() => [...messages].reverse());
  const [loading, setLoading, getLoad] = useGetState(false);
  const [addMessage] = useMutation(MessageMutation);
  const [cleanMessage] = useMutation(CleanMessageMutation, {
    onCompleted() {
      update([]);
    },
  });

  useMount(() => {
    const source = search.get("source");
    if (source === "prompt") {
      update((prev) => {
        const chats = [{ role: Role.ASSISTANT, content: "" }, ...prev];
        const messages = [...chats];
        messages.shift();
        if (prompt?.system) {
          messages.push({ role: Role.SYSTEM, content: prompt.system });
        }
        messages.reverse();

        generateResponse(
          messages.map(({ content, role }) => ({
            content,
            role: role?.toLowerCase(),
          }))
        );
        return chats;
      });
    }

    // set the dropdown menu element
    const $targetEl: HTMLElement = document.getElementById("dropdownMenu")!;

    // set the element that trigger the dropdown menu on click
    const $triggerEl: HTMLElement = document.getElementById("dropdownButton")!;

    // options with default values
    const options: DropdownOptions = {
      placement: "bottom",
      triggerType: "click",
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
    };

    dropdownRef.current = new Dropdown($targetEl, $triggerEl, options);
  });

  const generateResponse = async (
    chats: {
      role: string;
      content: string;
    }[]
  ) => {
    if (getLoad()) return;
    setLoading(true);

    const payload = {
      model: "gpt-3.5-turbo-16k",
      messages: chats,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
      stream: true,
      n: 1,
    };

    let text = "";
    controllerRef.current = new AbortController();
    // 通过 API 获取 OPENAI_API_KEY
    // 目前使用 turbo 缓存打包资产，直接在前端获取会导致 Key 在发布到社区没有变化的问题
    const ret = await fetch("/api/api_key", { method: "POST" });
    const key = await ret.text();

    // 使用 fetchSSE 函数向指定的 API 地址发送 POST 请求
    fetchSSE(`https://llm.1024code.com/v1/chat/completions`, {
      // 设置请求头
      headers: {
        "Content-Type": "application/json",
        // 携带 API_KEY 进行身份认证
        Authorization: `Bearer ${key}`,
      },
      method: "POST", // 设置请求方法为 POST
      signal: controllerRef.current.signal, // 指定请求的控制器信号
      body: JSON.stringify(payload), // 将请求体转换为 JSON 字符串并发送
      // 当接收到消息时触发的回调函数
      onMessage: (data) => {
        if (!getLoad()) return;
        // 如果接收到的消息是"[DONE]"，则表示对话结束，设置加载状态为false，并添加消息到数据库
        if (data === "[DONE]") {
          setLoading(false);
          addMessage({
            variables: { chatId, role: Role.ASSISTANT, content: text },
          });
          return;
        }

        try {
          // 尝试将接收到的消息解析为JSON对象
          const ret = JSON.parse(data);
          const finish_reason = ret.choices[0].finish_reason;
          // 判断对话是否结束
          const finish = finish_reason === "stop" || finish_reason === "length";
          // 获取对话回复的内容
          const content = ret.choices[0].delta.content;
          // 如果对话结束，则设置加载状态为false
          if (finish) {
            setLoading(false);
          }
          // 如果对话未结束且有回复内容，则将回复内容添加到当前对话文本中，并更新对话列表
          else if (content) {
            text += content;
            update((prev) => {
              prev[0].content = text;
              return [...prev];
            });
          }
        } catch (error) {
          // 如果解析消息出错，则设置加载状态为false，并将当前对话设置为解析消息出错。
          console.log("error", error);
          setLoading(false);
          update((prev) => {
            prev[0].content = "解析消息出错";
            prev[0].error = true;
            return [...prev];
          });
        }
      },
      // 当请求出错时执行的回调函数
      onError: async (res) => {
        // 获取错误信息
        const content = await res.text();
        // 设置 loading 状态为 false
        setLoading(false);
        // 如果错误状态码为 403，则提示用户 API_KEY 调用额度已用完
        if (res.status == 403) {
          update((prev) => {
            prev[0].content =
              "当前 API_KEY 调用额度已用完，请联系运营人员增加额度";
            prev[0].error = true;
            return [...prev];
          });
          return;
        }
        // 否则将错误信息更新到聊天记录中
        update((prev) => {
          prev[0].content = content;
          prev[0].error = true;
          return [...prev];
        });
      },
    }).catch(() => {
      setLoading(false);
      update((prev) => {
        prev[0].content = "未知错误";
        prev[0].error = true;
        return [...prev];
      });
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = formDataToObject(formData);
    setInput("");
    addMessage({ variables: { chatId, role: Role.USER, content: data.chat } });

    update((prev) => {
      const chats = [
        { role: Role.ASSISTANT, content: "" },
        { role: Role.USER, content: data.chat },
        ...prev,
      ];
      const messages = [...chats];
      messages.shift();
      if (prompt?.system) {
        messages.push({ role: Role.SYSTEM, content: prompt.system });
      }
      messages.reverse();

      generateResponse(
        messages.map(({ content, role }) => ({
          content,
          role: role?.toLowerCase(),
        }))
      );
      return chats;
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <nav className="bg-white border-b dark:bg-gray-900">
        <div className="w-full flex items-center mx-auto p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            onClick={() => router.back()}
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>

          <div className="flex-1 flex items-center justify-center gap-1">
            <div>{prompt?.icon || "💬"}</div>
            <div>{prompt?.name || "闲聊一下"}</div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            id="dropdownButton"
            className="w-6 h-6 text-blue-700 hover:text-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            // onClick={() => dropdownRef.current?.toggle()}
            data-dropdown-toggle="dropdownMenu"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
              clipRule="evenodd"
            />
          </svg>

          <div
            id="dropdownMenu"
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-24 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownButton"
            >
              <li>
                <div
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    cleanMessage({ variables: { chatId } });
                    dropdownRef.current?.hide();
                  }}
                >
                  清空消息
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="flex-1 pt-3 px-2 flex flex-col-reverse gap-2 overflow-y-auto overflow-x-hidden">
        <div className="flex-1"></div>

        {list.map(({ role, content, error }, inx) => (
          <div
            key={inx}
            className={classNames(
              "w-full flex items-end",
              role === Role.ASSISTANT ? "justify-start" : "justify-end"
            )}
          >
            <pre
              className={classNames(
                "p-2 rounded-md max-w-[90%] min-h-[40px] whitespace-pre-wrap break-words",
                loading && inx === 0 && "streaming",

                error
                  ? "bg-red-400 text-white"
                  : role === Role.ASSISTANT
                  ? "bg-black/5 text-gray-500"
                  : "bg-blue-600 text-white"
              )}
            >
              {content}
            </pre>
            {loading && inx === 0 && (
              <div
                className="w-4 h-4 ml-2 flex items-center justify-center rounded-xl border border-red-600"
                onClick={() => {
                  setLoading(false);
                  controllerRef.current?.abort();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-red-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}

        {!!examples?.length && (
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
      <form className="pt-2" onSubmit={onSubmit}>
        <label htmlFor="chat" className="sr-only">
          发送消息
        </label>
        <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700">
          <textarea
            id="chat"
            name="chat"
            required
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="block mx-2 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="发送消息..."
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className={classNames(
              "inline-flex justify-center p-2 text-blue-600 rounded-full dark:text-blue-500 ",
              !loading &&
                "cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600"
            )}
          >
            {loading ? (
              <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                data-icon="loading"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                className="animate-spin"
              >
                <path d="M955.733333 765.866667c0 0 0 2.133333 0 2.133333-12.8 21.333333-38.4 27.733333-57.6 14.933333-19.2-10.666667-27.733333-36.266667-17.066667-57.6l0 0c36.266667-64 57.6-136.533333 57.6-213.333333s-21.333333-151.466667-57.6-213.333333l0 0c-10.666667-19.2-4.266667-44.8 17.066667-57.6 21.333333-12.8 46.933333-4.266667 57.6 14.933333 0 0 0 2.133333 0 2.133333 42.666667 74.666667 68.266667 162.133333 68.266667 253.866667S998.4 691.2 955.733333 765.866667zM768 955.733333C768 955.733333 765.866667 955.733333 768 955.733333c-76.8 42.666667-164.266667 68.266667-256 68.266667s-179.2-25.6-253.866667-68.266667c0 0-2.133333 0-2.133333 0-21.333333-12.8-27.733333-38.4-14.933333-57.6 12.8-21.333333 38.4-27.733333 57.6-14.933333 0 0 0 0 2.133333 0l0 0C362.666667 917.333333 435.2 938.666667 512 938.666667s149.333333-21.333333 211.2-57.6l0 0c0 0 0 0 2.133333 0 21.333333-12.8 46.933333-4.266667 57.6 14.933333C795.733333 917.333333 789.333333 942.933333 768 955.733333zM727.466667 142.933333 727.466667 142.933333C663.466667 106.666667 590.933333 85.333333 512 85.333333s-151.466667 21.333333-213.333333 57.6l0 0c-19.2 10.666667-44.8 4.266667-57.6-17.066667C228.266667 106.666667 234.666667 81.066667 256 68.266667c0 0 2.133333 0 2.133333 0C332.8 25.6 420.266667 0 512 0s179.2 25.6 253.866667 68.266667c0 0 2.133333 0 2.133333 0 21.333333 12.8 27.733333 38.4 14.933333 57.6C772.266667 147.2 746.666667 153.6 727.466667 142.933333zM125.866667 782.933333C106.666667 795.733333 81.066667 789.333333 68.266667 768c0 0 0-2.133333 0-2.133333C25.6 691.2 0 603.733333 0 512s25.6-179.2 68.266667-253.866667c0 0 0-2.133333 0-2.133333 12.8-21.333333 38.4-27.733333 57.6-14.933333 21.333333 12.8 27.733333 38.4 14.933333 57.6 0 0 0 0 0 2.133333l0 0C106.666667 362.666667 85.333333 435.2 85.333333 512s21.333333 149.333333 57.6 211.2l0 0c0 0 0 0 0 2.133333C153.6 746.666667 147.2 772.266667 125.866667 782.933333z"></path>{" "}
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="w-6 h-6 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            )}
            <span className="sr-only">发送消息</span>
          </button>
        </div>
      </form>
    </div>
  );
}
