import React, { useState } from "react";

const DropArea = ({ handleDragOver, handleDrop, colId, idx }) => {
  const defaultDropSetting = "opacity-0 h-[10px]";
  const [currClass, setCurrClass] = useState(defaultDropSetting);

  function handleDragEnter(e) {
    e.preventDefault();
    setCurrClass("opacity-100 h-[190px]");
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setCurrClass(defaultDropSetting);
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={"w-full transition-all duration-300 ease-in-out " + currClass}
    >
      <div
        onDrop={(e) => {
          handleDrop(e, colId, idx);
          setCurrClass(defaultDropSetting);
        }}
        onDragOver={handleDragOver}
        className="absolute w-full min-h-[178px] max-h-[178px] border-2 border-dashed rounded-lg flex justify-center items-center text-lg border-[#1C1D2214] text-[#1C1D2280] dark:border-[#FFFFFF1A] dark:text-[#FFFFFF80]"
      >
        Drag your task here...
      </div>
    </div>
  );
};

export default DropArea;
