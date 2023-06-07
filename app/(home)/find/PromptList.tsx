"use client";

import React from "react";

interface PromptListProps {
  list: { id: string; name: string; icon: string; system: string }[];
}

export const PromptList = ({ list }: PromptListProps) => {
  return (
    <div className="p-3 w-full grid grid-cols-2 gap-4">
      {list.map(({ id, name, icon }) => (
        <div
          key={id}
          className="flex flex-col gap-1 p-3 rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
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
  );
};
