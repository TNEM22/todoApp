import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { BsThreeDots } from "react-icons/bs";
import { MdModeEdit, MdDelete } from "react-icons/md";

import DropArea from "./DropArea";

const Card = ({
  idx,
  item,
  colId,
  handleDrag,
  handleDrop,
  deleteTask,
  handleDragEnd,
  handleEditTask,
  handleDragOver,
  handleDragStart,
}) => {
  const theme = useSelector((state) => state.navigation.theme);
  const isFilterActive = useSelector((state) => state.operation.isFilterActive);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function formatDate(dateString) {
    const formatted = new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return formatted;
  }

  return (
    <div
      className="flex flex-col gap-0 select-none"
      style={{ zIndex: 1 }}
      // initial={{ opacity: 0, scale: 0 }}
      // animate={{ opacity: 1, scale: 1 }}
      // transition={{
      //   duration: 0.4,
      //   scale: { type: "spring", visualDuration: 0.4, bounce: 0.0 },
      // }}
    >
      <DropArea
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        colId={colId}
        idx={idx}
      />
      <div className="w-full min-h-[178px] max-h-[178px] grid">
        <div className="absolute w-full min-h-[178px] max-h-[178px] border-2 border-dashed rounded-lg flex justify-center items-center text-lg border-[#1C1D2214] text-[#1C1D2280] dark:border-[#FFFFFF1A] dark:text-[#FFFFFF80]">
          Drag your task here...
        </div>
        <div
          draggable={isFilterActive}
          onDragStart={(e) => handleDragStart(e, item)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative flex flex-col justify-between w-full max-w-[313px] min-h-[178px] max-h-[178px] rounded-lg border-2 border-[#1C1D2214] p-4 bg-white dark:bg-[#292B31]"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bold dark:text-white">{item.title}</h1>
              <h3 className="font-normal text-[15px] text-[#1C1D2280] dark:text-[#FFFFFF80]">
                {item.desc}
              </h3>
            </div>
            <div ref={dropdownRef}>
              <span
                onClick={() => setIsDialogOpen(!isDialogOpen)}
                tabIndex={0}
                className="cursor-pointer border-2 rounded-full p-1.5 flex border-[#1C1D221A] active:bg-[#1C1D221A] dark:border-[#FFFFFF1A] dark:active:bg-[#FFFFFF1A] dark:text-white"
              >
                <BsThreeDots size={12} />
              </span>
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDialogOpen && (
                  <motion.div
                    initial={{
                      opacity: 1,
                      scale: 0,
                      borderRadius: "50%",
                      y: -47,
                      x: 17,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      borderRadius: "5px",
                      y: 0,
                      x: 0,
                    }}
                    exit={{
                      opacity: 1,
                      scale: 0,
                      borderRadius: "50%",
                      y: -47,
                      x: 17,
                    }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    className="absolute right-2 rounded shadow bg-white dark:shadow-white dark:text-white dark:bg-[#24262C]"
                  >
                    <div
                      onClick={() => handleEditTask(colId, item)}
                      className="flex items-center cursor-pointer rounded-t p-1 hover:bg-[#00000019] dark:hover:bg-[#ffffff19]"
                    >
                      <MdModeEdit />
                      &nbsp;Edit
                    </div>
                    <div className="border-b"></div>
                    <div
                      onClick={() => deleteTask(colId, item.id)}
                      className="flex items-center cursor-pointer rounded-b p-1 hover:bg-[#ff0000aa]"
                    >
                      <MdDelete />
                      &nbsp;Delete
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Progress */}
          <div>
            <div className="flex justify-between">
              <div className="flex items-center text-[#1C1D2280] dark:text-[#FFFFFF80]">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* <!-- First bullet and line --> */}
                  <rect
                    x="2"
                    y="3"
                    width="3"
                    height="2"
                    rx="1"
                    fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
                  />
                  <rect
                    x="7"
                    y="3"
                    width="11"
                    height="2"
                    rx="1"
                    fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
                  />

                  {/* <!-- Second bullet and line --> */}
                  <rect
                    x="2"
                    y="7"
                    width="3"
                    height="2"
                    rx="1"
                    fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
                  />
                  <rect
                    x="7"
                    y="7"
                    width="11"
                    height="2"
                    rx="1"
                    fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
                  />

                  {/* <!-- Third bullet and line --> */}
                  <rect
                    x="2"
                    y="11"
                    width="3"
                    height="2"
                    rx="1"
                    fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
                  />
                  <rect
                    x="7"
                    y="11"
                    width="11"
                    height="2"
                    rx="1"
                    fill={theme === "dark" ? "#FFFFFF80" : "#1C1D2280"}
                  />
                </svg>
                &nbsp;Progress
              </div>
              <div className="dark:text-white">
                {item.completedMilestones.length}/{item.milestones.length}
              </div>
            </div>
            <div className="h-[4px] w-full rounded-lg mt-2 bg-[#1C1D2214] dark:bg-[#FFFFFF1A]">
              <div
                className={
                  item.milestones.length != item.completedMilestones.length
                    ? "h-full w-[3%] bg-[#FFA048] rounded-lg"
                    : "h-full w-[3%] bg-[#78D700] rounded-lg"
                }
                style={{
                  width:
                    (item.completedMilestones.length / item.milestones.length ||
                      0.03) *
                      100 +
                    "%",
                }}
              ></div>
            </div>
          </div>
          {/* Bottom */}
          <div className="flex justify-between text-[#888DA7] dark:text-[#989CAA]">
            <div className="rounded-2xl w-fit px-3 py-1 bg-[#888DA71A] dark:bg-[#FFFFFF0F]">
              {formatDate(item.assignedDate)}
            </div>
            <div className="flex">
              {/* Comment */}
              <div className="flex items-center cursor-pointer mr-3">
                <div id="comment" className="flex mr-1">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 1.5C0 0.671573 0.671573 0 1.5 0H13.5C14.3284 0 15 0.671573 15 1.5V9.75C15 10.5784 14.3284 11.25 13.5 11.25H10.0607L8.03033 13.2803C7.73744 13.5732 7.26256 13.5732 6.96967 13.2803L4.93934 11.25H1.5C0.671573 11.25 0 10.5784 0 9.75V1.5ZM13.5 1.5H1.5V9.75H5.25C5.44891 9.75 5.63968 9.82902 5.78033 9.96967L7.5 11.6893L9.21967 9.96967C9.36032 9.82902 9.55109 9.75 9.75 9.75H13.5V1.5ZM3 4.125C3 3.71079 3.33579 3.375 3.75 3.375H11.25C11.6642 3.375 12 3.71079 12 4.125C12 4.53921 11.6642 4.875 11.25 4.875H3.75C3.33579 4.875 3 4.53921 3 4.125ZM3 7.125C3 6.71079 3.33579 6.375 3.75 6.375H8.25C8.66421 6.375 9 6.71079 9 7.125C9 7.53921 8.66421 7.875 8.25 7.875H3.75C3.33579 7.875 3 7.53921 3 7.125Z"
                      fill="#888DA7"
                    />
                  </svg>
                </div>
                <div className="text-base font-baloo-2 font-semibold">
                  {item.comments.length}
                </div>
              </div>
              {/* Paperclip */}
              <div className="flex items-center cursor-pointer">
                <div id="paper_clip" className="flex mr-1">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5971 2.1818C13.0816 1.61948 12.1508 1.58483 11.5303 2.20533L5.45529 8.28033C5.29819 8.43744 5.29819 8.63757 5.45529 8.79467C5.6124 8.95178 5.81253 8.95178 5.96963 8.79467L10.9946 3.76967C11.2875 3.47678 11.7624 3.47678 12.0553 3.76967C12.3482 4.06257 12.3482 4.53744 12.0553 4.83033L7.03029 9.85533C6.2874 10.5982 5.13753 10.5982 4.39463 9.85533C3.65174 9.11244 3.65174 7.96257 4.39463 7.21967L10.4696 1.14467C11.6453 -0.0309737 13.5558 -0.0692286 14.6917 1.15616C15.8559 2.33247 15.8902 4.23368 14.6696 5.366L7.55529 12.4803C5.9124 14.1232 3.33753 14.1232 1.69463 12.4803C0.0517402 10.8374 0.0517402 8.26257 1.69463 6.61967L7.76963 0.544675C8.06252 0.251782 8.5374 0.251782 8.83029 0.544675C9.12319 0.837568 9.12319 1.31244 8.83029 1.60533L2.75529 7.68033C1.69819 8.73744 1.69819 10.3626 2.75529 11.4197C3.8124 12.4768 5.43753 12.4768 6.49463 11.4197L13.6196 4.29467C13.6273 4.28699 13.6352 4.27948 13.6432 4.27214C14.2055 3.75668 14.2401 2.82584 13.6196 2.20533C13.6119 2.19765 13.6044 2.18981 13.5971 2.1818Z"
                      fill="#888DA7"
                    />
                  </svg>
                </div>
                <div className="text-base font-baloo-2 font-semibold">
                  {item.pinned.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
