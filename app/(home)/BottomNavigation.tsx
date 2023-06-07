"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: any = {
  chat: (
    <svg
      className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-aria-selected:text-blue-600 dark:group-aria-selected:text-blue-500"
      fill="currentColor"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0 81.279999v409.329462a354.33564 354.33564 0 0 0 30.209066 143.15722l49.673933 112.474021a77.173666 77.173666 0 0 0 123.489154 25.019l147.796954-139.101687a245.705486 245.705486 0 0 1 168.396353-66.782244h245.166442a77.173666 77.173666 0 0 0 77.176488-77.173666V81.279999A77.173666 77.173666 0 0 0 764.737546 4.103511H77.176488A77.173666 77.173666 0 0 0 0.002822 81.279999z"></path>
      <path d="M963.458677 397.143106h-3.982155a58.863088 58.863088 0 0 0-58.865911 58.865911v109.61511a71.684444 71.684444 0 0 1-71.684443 71.684443h-231.504064a227.919842 227.919842 0 0 0-156.207176 61.950599l-82.118199 77.289377a12.491155 12.491155 0 0 0-0.671689 3.547534 61.216821 61.216821 0 0 0 61.213999 61.213999h193.816109a194.589398 194.589398 0 0 1 133.36411 52.888444l116.769443 109.902976a61.216821 61.216821 0 0 0 97.953688-19.845866l39.217599-88.795577a280.551463 280.551463 0 0 0 23.915511-113.346088V458.36275a61.216821 61.216821 0 0 0-61.216822-61.216821z"></path>
    </svg>
  ),
  find: (
    <svg
      className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-aria-selected:text-blue-600 dark:group-aria-selected:text-blue-500"
      fill="currentColor"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M512 0C228.072727 0 0 228.072727 0 512s228.072727 512 512 512 512-228.072727 512-512S795.927273 0 512 0z m253.672727 274.618182l-93.090909 304.872727c-13.963636 44.218182-48.872727 81.454545-93.090909 93.090909l-304.872727 93.090909c-9.309091 2.327273-18.618182-6.981818-16.290909-16.290909l93.090909-304.872727c13.963636-44.218182 48.872727-81.454545 93.090909-93.090909l304.872727-93.090909c9.309091-2.327273 18.618182 6.981818 16.290909 16.290909z"></path>
      <path d="M512 512m-58.181818 0a58.181818 58.181818 0 1 0 116.363636 0 58.181818 58.181818 0 1 0-116.363636 0Z"></path>
    </svg>
  ),
  mine: (
    <svg
      className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-aria-selected:text-blue-600 dark:group-aria-selected:text-blue-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
      ></path>
    </svg>
  ),
};

const menus = [
  { href: "/", name: "对话", key: "chat" },
  { href: "/find", name: "发现", key: "find" },
  { href: "/mine", name: "我的", key: "mine" },
];

export const BottomNavigation = () => {
  const pathname = usePathname();
  return (
    <div className="w-full h-16 bg-white border-t dark:bg-gray-700">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        {menus.map(({ key, name, href }) => (
          <Link
            key={key}
            href={href}
            aria-selected={href === pathname}
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            {icons[key]}
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-aria-selected:text-blue-600 dark:group-aria-selected:text-blue-500">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
