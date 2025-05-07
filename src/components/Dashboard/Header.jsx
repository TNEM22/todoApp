import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { LuCalendar } from "react-icons/lu";
import { FaSistrix } from "react-icons/fa";

import userLogo from "../../assets/user.png";

const Header = () => {
  const [currentDate, setCurrentDate] = useState("19 May 2022");
  const theme = useSelector((state) => state.navigation.theme);

  useEffect(() => {
    const today = new Date();
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = today
      .toLocaleDateString("en-GB", options)
      .replace(/ /g, " ");
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="w-full flex justify-between p-5 text-[#1C1D22] dark:text-white">
      <h1 className="text-2xl font-bold">
        Welcome back, {localStorage.name || "Vincent"}👋
      </h1>
      <div className="flex justify-center items-center text-2xl gap-5 text-[#FFFFFF80]">
        <div className="cursor-pointer text-[#1C1D2280] dark:text-[#FFFFFF80]">
          <FaSistrix />
        </div>
        <div className="cursor-pointer">
          <svg
            width="28"
            height="28"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.30063 2.97744C9.57303 2.30648 10.2313 1.83333 11 1.83333C11.7687 1.83333 12.427 2.30648 12.6994 2.97744C15.4185 3.72232 17.4167 6.21114 17.4167 9.16667V13.4725L19.096 15.9915C19.2836 16.2728 19.3011 16.6345 19.1415 16.9325C18.982 17.2306 18.6714 17.4167 18.3333 17.4167H14.1758C13.9534 18.9715 12.6163 20.1667 11 20.1667C9.3837 20.1667 8.04656 18.9715 7.82416 17.4167H3.66667C3.32861 17.4167 3.01798 17.2306 2.85847 16.9325C2.69895 16.6345 2.71643 16.2728 2.90396 15.9915L4.58333 13.4725V9.16667C4.58333 6.21114 6.58151 3.72232 9.30063 2.97744ZM9.70324 17.4167C9.892 17.9507 10.4013 18.3333 11 18.3333C11.5987 18.3333 12.108 17.9507 12.2968 17.4167H9.70324ZM11 4.58333C8.4687 4.58333 6.41667 6.63536 6.41667 9.16667V13.75C6.41667 13.931 6.3631 14.1079 6.26271 14.2585L5.37948 15.5833H16.6205L15.7373 14.2585C15.6369 14.1079 15.5833 13.931 15.5833 13.75V9.16667C15.5833 6.63536 13.5313 4.58333 11 4.58333Z"
              fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
            />
            <circle
              cx="17"
              cy="5"
              r="3.5"
              fill="#FFA048"
              stroke={theme === "dark" ? "#2A2B2F" : "white"}
            />
          </svg>
        </div>
        <div className="cursor-pointer flex items-center text-[#1C1D2280] dark:text-[#FFFFFF80]">
          <LuCalendar />
          &nbsp;
          <span className="text-lg font-bold text-[#1C1D2280] dark:text-[#FFFFFF80]">
            {currentDate}
          </span>
        </div>
        <div className="cursor-pointer rounded-full">
          <img
            src={userLogo}
            alt="User Image"
            className="w-[40px] h-[40px] object-cover object-center rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
