import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import { BsThreeDots } from "react-icons/bs";

import { setIsModalOpen, setModalName } from "../../store/slices/modalSlice";
import {
  setIsFilterActive,
  setIsSortActive,
  setSortType,
  setShowSortDropdown,
  setShowManageDropdown,
} from "../../store/slices/operationSlice";

const categories = {
  Project: ["Edit", "Delete"],
  Columns: ["Edit"],
};

const sortCategories = ["off", "A-Z", "Z-A", "Date", "Progress"];

const SubHeader = () => {
  const theme = useSelector((state) => state.navigation.theme);
  const isFilterActive = useSelector((state) => state.operation.isFilterActive);
  const isSortActive = useSelector((state) => state.operation.isSortActive);
  const sortType = useSelector((state) => state.operation.sortType);

  const dispatch = useDispatch();
  const showManageDropdown = useSelector(
    (state) => state.operation.showManageDropdown
  );
  // const [showFirstDropdown, setShowFirstDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const toggleDropdown = () => {
    dispatch(setShowManageDropdown(!showManageDropdown));
    setSelectedCategory("");
  };

  const handleCategorySelect = (category) => setSelectedCategory(category);

  const handleItemSelect = (item) => {
    dispatch(setShowManageDropdown(false));
    dispatch(
      setModalName(`${item.toLowerCase()}-${selectedCategory.toLowerCase()}`)
    );
    dispatch(setIsModalOpen(true));
  };

  const showSortDropdown = useSelector(
    (state) => state.operation.showSortDropdown
  );
  // const [showSortDropdown, setSortDropdown] = useState(false);

  const toggleSortDropdown = () => {
    dispatch(setShowSortDropdown(!showSortDropdown));
  };

  const handleSortSelect = (sortType) => {
    if (sortType === "off") {
      dispatch(setIsSortActive(false));
      dispatch(setSortType(null));
    } else {
      dispatch(setIsSortActive(true));
      dispatch(setSortType(sortType));
    }
    dispatch(setShowSortDropdown(false));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch(setShowManageDropdown(false));
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target)
      ) {
        dispatch(setShowSortDropdown(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openBoardModal = (type) => {
    dispatch(setModalName(`${type}-board`));
    dispatch(setIsModalOpen(true));
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex justify-between text-lg select-none border-b-3 border-collapse mx-5 border-[#1C1D2214] dark:border-[#FFFFFF1A]"
    >
      {/* Views */}
      <div id="add-views" className="flex gap-3 -mb-[2.5px] font-semibold">
        <span className="flex items-center py-2 px-2 cursor-pointer border-b-3 border-black dark:border-white dark:text-white">
          <svg
            width="20"
            height="20"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <rect
              x="10"
              y="10"
              width="80"
              height="30"
              rx="5"
              stroke={theme === "dark" ? "#FFFFFF" : "#1C1D22"}
              strokeWidth="10"
            />
            <rect
              x="10"
              y="60"
              width="80"
              height="30"
              rx="5"
              stroke={theme === "dark" ? "#FFFFFF" : "#1C1D22"}
              strokeWidth="10"
            />
          </svg>
          &nbsp; Board view
        </span>
        <span
          onClick={() => openBoardModal("add")}
          className="flex items-center py-2 px-2 cursor-pointer text-[#1C1D2280] dark:text-white"
        >
          <h1 className="px-2 w-[20px] h-[20px] text-lg font-bold rounded-full leading-[1] flex justify-center bg-[#1C1D2214] text-[#1c1d225b] dark:bg-[#FFFFFF14] dark:text-[#ffffff69]">
            +
          </h1>
          &nbsp; Add view
        </span>
      </div>
      <div className="flex gap-4 font-medium">
        {/* Filter */}
        <span
          id="dropdown-btn"
          onClick={() => dispatch(setIsFilterActive(!isFilterActive))}
          className={
            "cursor-pointer " +
            (isFilterActive
              ? "dark:text-white"
              : "text-[#1C1D2280] dark:text-[#FFFFFF80]")
          }
        >
          Filter
        </span>
        {/* Sort */}
        <span id="sort-btn" ref={sortDropdownRef}>
          <button
            onClick={() => toggleSortDropdown()}
            className={
              "cursor-pointer flex justify-center " +
              (isSortActive
                ? "dark:text-white"
                : "text-[#1C1D2280] dark:text-[#FFFFFF80]")
            }
          >
            {/* Sort {sortType && `(by ${sortType})`} */}
            <span>Sort&nbsp;</span>
            <AnimatePresence mode="popLayout">
              {sortType && (
                <motion.span
                  key={sortType}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "inline-block", whiteSpace: "nowrap" }}
                >
                  (<span className="text-base text-blue-300">{sortType}</span>)
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                id="sort-options"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed z-40 pt-3"
              >
                <div className="w-40 h-min rounded-lg bg-white text-[#1C1D22] shadow-md dark:bg-[#2e2f36] dark:text-white dark:shadow dark:shadow-white relative">
                  {sortCategories.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleSortSelect(item)}
                      className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-[#3b3c43]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </span>
        {/* The three dots */}
        <span id="manage-projects-columns" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="cursor-pointer border-2 rounded-full p-1.5 flex border-[#1C1D221A] active:bg-[#1C1D221A] dark:border-[#FFFFFF1A] dark:active:bg-[#FFFFFF1A] dark:text-white"
          >
            <BsThreeDots size={12} />
          </button>
          <AnimatePresence>
            {showManageDropdown && (
              <motion.div
                id="projects-columns-options"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed z-40 pt-3"
              >
                {/* First Dropdown */}
                <div className="w-40 h-min rounded-lg bg-white text-[#1C1D22] shadow-md dark:bg-[#2e2f36] dark:text-white dark:shadow dark:shadow-white relative">
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

                  {/* Second Dropdown */}
                  {selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-40 h-min rounded-lg bg-white text-[#1C1D22] shadow-md dark:bg-[#2e2f36] dark:text-white dark:shadow dark:shadow-white absolute top-0 right-full mr-2"
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </span>
        <span>
          <span className="cursor-pointer text-base px-7 py-3 text-white active:ring-4 active:ring-blue-500 rounded-full bg-[#1C1D22] dark:bg-[#4B69FF]">
            New template
          </span>
        </span>
      </div>
    </motion.div>
  );
};

export default SubHeader;
