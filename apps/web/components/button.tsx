import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
export type ButtonType = "primary" | "default";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  mode?: ButtonType;
};

export const Button = ({
  className,
  children,
  loading,
  mode = "default",
  ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={loading}
    className={classNames(
      className,
      mode === "default" &&
        "text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 focus:ring-blue-300 focus-visible:outline-gray-600",
      mode === "primary" &&
        "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
      "relative flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    )}
  >
    {children}
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center rounded-md text-lg text-white/80 bg-black/40">
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
      </div>
    )}
  </button>
);
