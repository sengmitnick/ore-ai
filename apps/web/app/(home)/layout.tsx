import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { App } from "../app";
import classNames from "classnames";
import { BottomNavigation } from "./BottomNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ore AI",
  description: "聊天智能助手 AI对话写作",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-Hans" className="w-full h-full bg-slate-600">
      <body
        className={classNames(
          inter.className,
          "w-full h-full max-w-screen-sm mx-auto flex flex-col overflow-hidden bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-600"
        )}
      >
        <App>
          <div className="flex-1 flex flex-col overflow-auto">{children}</div>
          <BottomNavigation />
        </App>
      </body>
    </html>
  );
}
