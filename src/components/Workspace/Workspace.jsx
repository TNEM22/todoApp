import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import SubHeader from "./SubHeader";
import DragnDrop from "./DragnDrop";

const Workspace = () => {
  const selectedProject = useSelector((state) => state.project.selectedProject);

  return (
    <div
      className="flex flex-1 flex-col h-full min-h-0"
      style={{ width: window.innerWidth - 314 - 90 }}
    >
      {selectedProject !== null ? (
        <>
          <SubHeader />
          <DragnDrop />
        </>
      ) : (
        <div className="text-4xl flex flex-1 justify-center items-center text-[#222327] dark:text-white">
          <motion.h1
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-3xl font-extrabold mb-4"
          >
            No Project selected.
          </motion.h1>
        </div>
      )}
    </div>
  );
};

export default Workspace;
