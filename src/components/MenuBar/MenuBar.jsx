import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import { PiSunBold, PiMoonBold } from "react-icons/pi";

import Features from "./Features";

import { setIsModalOpen, setModalName } from "../../store/slices/modalSlice";
import { setTheme as setGlobalTheme } from "../../store/slices/navigationSlice";
import {
  setShowProjectsDropdown,
  setProjectsSelectedCategory as setSelectedCategory,
} from "../../store/slices/operationSlice";

const categories = {
  Team: ["Create", "Edit", "Delete"],
  Project: ["Create"],
};

const MenuBar = () => {
  const dispatch = useDispatch();
  const showProjectsDropdown = useSelector(
    (state) => state.operation.showProjectsDropdown
  );
  // const [showFirstDropdown, setShowFirstDropdown] = useState(false);
  const selectedCategory = useSelector(
    (state) => state.operation.projectsSelectedCategory
  );
  // const [selectedCategory, setSelectedCategory] = useState("");
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    dispatch(setShowProjectsDropdown(!showProjectsDropdown));
    dispatch(setSelectedCategory(""));
  };

  const handleCategorySelect = (category) =>
    dispatch(setSelectedCategory(category));

  const handleItemSelect = (item) => {
    dispatch(setShowProjectsDropdown(false));
    dispatch(
      setModalName(`${item.toLowerCase()}-${selectedCategory.toLowerCase()}`)
    );
    dispatch(setIsModalOpen(true));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch(setShowProjectsDropdown(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3, ease: "linear" }}
      className="max-w-[310px] min-w-[310px] px-4 py-6 z-10 shadow-custom-project flex flex-col font-bold justify-between select-none overflow-y-auto dark:text-white dark:bg-[#222327]"
    >
      <div id="menu-bar">
        {/* Title Bar */}
        <div className="w-full flex justify-between relative">
          <h1 className="text-3xl leading-[100%] tracking-[0px] text-[#1C1D22] dark:text-white">
            Projects
          </h1>

          {/* Plus Icon and Dropdown Menu */}
          <div id="create-project-btn" className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="p-3 pb-4 w-[30px] h-[30px] border-2 border-[#1C1D2214] dark:focus-[#FFFFFF14] focus:border-black dark:focus:border-white text-2xl font-bold flex items-center justify-center rounded-full leading-[1] cursor-pointer bg-[#1C1D2214] active:bg-[#1c1d2228] text-[#1c1d225b] active:text-[#1c1d227f] dark:bg-[#FFFFFF14] dark:text-[#ffffff69] dark:active:bg-[#ffffff73]"
            >
              +
            </button>

            <AnimatePresence>
              {showProjectsDropdown && (
                <motion.div
                  id="projects-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed z-40 pt-3 flex space-x-2"
                >
                  {/* First Dropdown */}
                  <div className="w-40 h-min rounded-lg bg-white text-[#1C1D22] shadow-md dark:bg-[#2e2f36] dark:text-white dark:shadow dark:shadow-white">
                    {Object.keys(categories).map((item) => (
                      <div
                        key={item}
                        onClick={() => handleCategorySelect(item)}
                        className={`flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-[#3b3c43] ${
                          selectedCategory === item
                            ? "bg-gray-200 dark:bg-[#3b3c43]"
                            : ""
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Second Dropdown */}
                  {selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-40 h-min rounded-lg bg-white text-[#1C1D22] shadow-md dark:bg-[#2e2f36] dark:text-white dark:shadow dark:shadow-white"
                    >
                      <AnimatePresence>
                        {categories[selectedCategory].map((item, idx) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, y: -20 * idx }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 * idx }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleItemSelect(item)}
                            className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-[#3b3c43]"
                          >
                            {item}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Features */}
        <Features />
      </div>
      {/* Dark / Light */}
      <ThemeSwitch />
    </motion.div>
  );
};

const ThemeSwitch = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.querySelector("html").classList.remove("dark", "light");
    document.querySelector("html").classList.add(theme);
    localStorage.setItem("theme", theme);
    dispatch(setGlobalTheme(theme));
  }, [theme, dispatch]);

  return (
    <div id="theme-switch" className="flex relative">
      {/* Background */}
      <div className="rounded-full absolute inset-0 bg-[#e5e5e565] dark:text-white dark:bg-white dark:opacity-5"></div>
      {/* Select Background */}
      <motion.div
        className="w-1/2 h-10/12 rounded-full absolute mt-1 mx-1.5 top-0 shadow-xl bg-white dark:right-0 dark:shadow dark:bg-[#FFFFFF0F]"
        layout
        transition={{
          type: "spring",
          visualDuration: 0.5,
          bounce: 0.3,
        }}
      ></motion.div>
      <div
        onClick={() => setTheme("light")}
        className="flex py-3 items-center justify-center flex-1 relative z-10 cursor-pointer text-[#1C1D22] dark:text-white dark:opacity-50"
      >
        <PiSunBold />
        &nbsp;&nbsp;Light
      </div>
      <div
        onClick={() => setTheme("dark")}
        className="flex items-center justify-center flex-1 relative z-10 cursor-pointer text-[#1C1D22] dark:text-white"
      >
        <PiMoonBold />
        &nbsp;&nbsp;Dark
      </div>
    </div>
  );
};

export default MenuBar;
