import "./globals.scss";
import classNames from "classnames";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ore AI",
  description: "聊天智能助手 AI对话写作",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-Hans" className="h-full bg-white">
      <body className={classNames(inter.className, "h-full")}>{children}</body>
    </html>
  );
}
