"use client";

import React, { FormEventHandler, useRef } from "react";
import { Modal } from "flowbite";
import gql from "graphql-tag";
import type { ModalOptions, ModalInterface } from "flowbite";
import { useMount, useSetState } from "ahooks";
import { Button } from "@/components";
import { useMutation } from "@apollo/client";
import { Token } from "@/utils";
import { useRouter } from "next/navigation";

const ChatMutation = gql`
  mutation ChatMutation($userId: ID!, $promptId: ID!) {
    chat(userId: $userId, promptId: $promptId) {
      id
    }
  }
`;

type PromptInfoProps = {
  id: string;
  name: string;
  icon: string;
  system: string;
};
interface PromptListProps {
  list: PromptInfoProps[];
}

export const PromptList = ({ list }: PromptListProps) => {
  const router = useRouter();
  const modalRef = useRef<ModalInterface>();
  const [addChat, { loading }] = useMutation(ChatMutation, {
    onCompleted(data) {
      modalRef.current?.hide();
      router.push(`/chat/${data.chat.id}?source=prompt`);
    },
  });
  const [formData, setFormData] = useSetState<PromptInfoProps>({
    id: "",
    name: "",
    icon: "",
    system: "",
  });

  useMount(() => {
    const $modalElement: HTMLElement = document.querySelector("#prompt-modal")!;

    const modalOptions: ModalOptions = {
      placement: "center",
      backdrop: "dynamic",
      backdropClasses:
        "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
      closable: false,
      onHide: () => {
        setFormData({ id: "", name: "", icon: "", system: "" });
      },
    };

    modalRef.current = new Modal($modalElement, modalOptions);
  });

  const handleClose = () => {
    if (loading) return;
    modalRef.current?.hide();
  };
  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const userId = Token.token;
    if (!userId) {
      router.push("/login");
      return;
    }
    addChat({ variables: { promptId: formData.id, userId } });
  };
  return (
    <>
      <div className="p-3 w-full grid grid-cols-2 gap-4">
        {list.map(({ id, name, icon, system }) => (
          <div
            key={id}
            className="flex flex-col gap-1 p-3 rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            onClick={() => {
              setFormData({ id, name, icon, system });
              modalRef.current?.show();
            }}
          >
            <div className="w-full flex items-center justify-between">
              <div>{icon}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white/60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>{name}</div>
          </div>
        ))}
      </div>
      <div
        id="prompt-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={handleClose}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                创建对话
              </h3>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    名称
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="icon"
                      id="icon"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-none w-9 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      disabled
                      value={formData.icon}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      disabled
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    主题
                  </label>
                  <textarea
                    name="system"
                    id="system"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                    disabled
                    value={formData.system}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="w-full flex items-center space-x-2 rounded-b dark:border-gray-600">
                  <Button mode="primary" loading={loading} type="submit">
                    确认
                  </Button>
                  <Button type="button" onClick={handleClose}>
                    取消
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
