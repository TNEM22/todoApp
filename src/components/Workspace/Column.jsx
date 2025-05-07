import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import Card from "./Card";

const Column = ({
  colId,
  title,
  tasks,
  addTask,
  itemsLen,
  deleteTask,
  handleDrop,
  containerRef,
  handleEditTask,
  setDroppingItem,
  setCurrentContainer,
}) => {
  const isFilterActive = useSelector((state) => state.operation.isFilterActive);
  const isSortActive = useSelector((state) => state.operation.isSortActive);
  const sortType = useSelector((state) => state.operation.sortType);

  const [sortedTasks, setSortedTasks] = useState(tasks || []);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const colContainer = useRef();

  useEffect(() => {
    if (!tasks) return;
    if (isSortActive === true && tasks.length > 0 && sortType !== null) {
      let sortedTasks;
      switch (sortType) {
        case "A-Z":
          sortedTasks = [...tasks].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          break;
        case "Z-A":
          sortedTasks = [...tasks].sort((a, b) =>
            b.title.localeCompare(a.title)
          );
          break;
        case "Date":
          sortedTasks = [...tasks].sort((a, b) => {
            const aDate = new Date(a.assignedDate);
            const bDate = new Date(b.assignedDate);
            return aDate - bDate;
          });
          break;
        case "Progress":
          sortedTasks = [...tasks].sort((a, b) => a.progress - b.progress);
          break;
      }
      setSortedTasks(sortedTasks);
    } else {
      setSortedTasks(tasks);
    }
  }, [tasks, isSortActive, sortType]);

  function handleDragStart(e, item) {
    setCurrentContainer(colContainer);
    colContainer.current.style.zIndex = 0;
    e.target.parentNode.parentNode.style.zIndex = 0;
    setDroppingItem({ ...item });
    setIsDragging(true);
    e.target.style.cursor = "pointer";

    const rect = e.target.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleDrag(e) {
    if (isDragging === false) return;
    e.target.style.position = "fixed";
    e.target.style.cursor = "pointer";

    // Prevent updating when the event has no coordinates (e.g., when the drag ends)
    if (e.clientX === 0 && e.clientY === 0) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const threshold = 100;
    const y = e.clientY - position.y;
    const x = e.clientX - position.x;

    if (e.clientY > rect.top && e.clientY < rect.bottom)
      e.target.style.top = y + "px";
    if (e.clientX > rect.left && e.clientX < rect.right)
      e.target.style.left = x + "px";

    // Right edge check
    if (mouseX > rect.right - threshold) {
      container.scrollLeft += 10;
    }
    // Left edge check
    else if (mouseX < rect.left + threshold) {
      container.scrollLeft -= 10;
    }

    // Top edge check
    if (mouseY < rect.top + threshold) {
      container.scrollTop -= 10;
    }
    // Bottom edge check
    if (mouseY > rect.bottom - threshold) {
      container.scrollTop += 10;
    }
  }

  function handleDragEnd(e) {
    setCurrentContainer(null);
    colContainer.current.style.zIndex = 1;
    e.target.parentNode.parentNode.style.zIndex = 1;
    setIsDragging(false);
    e.target.style.position = "relative";
    // e.target.style.backgroundColor = "white";
    e.target.style.top = 0 + "px";
    e.target.style.left = 0 + "px";
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.target.innerText = "";
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.target.innerText = "Drag your task here...";
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  return (
    <motion.div
      id="task-status-column"
      ref={colContainer}
      style={{ zIndex: 1 }}
      className="min-w-[350px] max-w-[350px] min-h-fit flex-shrink-0 flex-1 rounded-lg p-4 border-3 border-dashed border-[#1C1D2214] dark:bg-[#24262C]"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.0 },
      }}
    >
      {/* Header */}
      <div className="w-full mb-4 flex justify-between select-none">
        <h1 className="text-[#1C1D2280] dark:text-[#FFFFFF80]">
          {title}&nbsp;({itemsLen || 0})
        </h1>
        <div
          className="flex items-center cursor-pointer text-[#1C1D2280] dark:text-white"
          onClick={() => addTask(colId)}
        >
          <h1 className="px-2 w-[20px] h-[20px] text-lg font-bold rounded-full leading-[1] flex justify-center bg-[#1C1D2214] text-[#1c1d225b] dark:bg-[#FFFFFF14] dark:text-[#ffffff69]">
            +
          </h1>
          &nbsp; Add new task
        </div>
      </div>
      {/* Body */}
      <div className="relative min-w-[313px] max-w-[313px] flex flex-col gap-2">
        {/* Card */}
        {sortedTasks &&
          sortedTasks.map((item, idx) => (
            <Card
              key={item.id + colId}
              handleDrag={handleDrag}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              item={item}
              idx={idx}
              colId={colId}
              handleEditTask={handleEditTask}
              deleteTask={deleteTask}
            />
          ))}

        {/* Drop Space */}
        {(sortedTasks === undefined || sortedTasks.length < 4) &&
          isFilterActive && (
            <div className="w-full mt-1 min-h-[178px] max-h-[178px] grid">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, colId, -1)}
                onDragOver={handleDragOver}
                className="absolute w-full min-h-[178px] max-h-[178px] border-2 border-dashed rounded-lg flex justify-center items-center text-lg border-[#1C1D2214] text-[#1C1D2280] dark:border-[#FFFFFF1A] dark:text-[#FFFFFF80]"
              >
                Drag your task here...
              </div>
            </div>
          )}
      </div>
    </motion.div>
  );
};

export default Column;
