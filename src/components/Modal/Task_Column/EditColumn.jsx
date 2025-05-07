import axios from "axios";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { setTasks } from "../../../store/slices/projectSlice";

import { SERVER_URL } from "../../../Constants";

const EditColumn = ({ closeModal }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.project.features.TASKS);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const [columns, setColumns] = useState([...tasks]);

  const handleTitleChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].title = value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([
      ...columns,
      { id: uuidv4(), title: "", count: 0, isActive: false },
    ]);
  };

  const deleteColumn = (index) => {
    if (columns.length <= 3) return;
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const moveColumnUp = (index) => {
    if (index === 0) return;
    const newColumns = [...columns];
    [newColumns[index - 1], newColumns[index]] = [
      newColumns[index],
      newColumns[index - 1],
    ];
    setColumns(newColumns);
  };

  const moveColumnDown = (index) => {
    if (index === columns.length - 1) return;
    const newColumns = [...columns];
    [newColumns[index + 1], newColumns[index]] = [
      newColumns[index],
      newColumns[index + 1],
    ];
    setColumns(newColumns);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log("Columns to submit:", columns);

    const url = `${SERVER_URL}/api/v1/projects/`;
    toast.promise(
      axios
        .patch(
          url,
          { id: selectedProject, columns: columns },
          {
            headers: {
              Authorization: `Bearer ${localStorage.token}`,
            },
          }
        )
        .then((response) => {
          const dd = response.data;
          if (dd.status === "error") {
            throw new Error();
          } else {
            // console.log(dd.data);
            const newColumns = dd.data.columns.reduce((acc, col) => {
              acc.push({
                _id: col._id,
                id: col._id,
                title: col.title,
                count: 0,
                isActive: false,
              });
              return acc;
            }, []);
            // console.log(newColumns);

            dispatch(setTasks(newColumns));
            closeModal();
          }
        })
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        }),
      {
        pending: "Updating project...",
        success: "Project updated!",
        error: "Cannot update project!",
      }
    );
  };

  return (
    <motion.form
      onSubmit={handleFormSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div layout className="space-y-4">
        <AnimatePresence>
          {columns.map((col, index) => (
            <motion.div
              key={col.id}
              layout
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                value={col.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder={`Column ${index + 1} title...`}
                required
                className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {/* Arrows button */}
              <motion.button
                type="button"
                whileHover={{ scale: index === 0 ? 1 : 1.2 }}
                disabled={index === 0}
                onClick={() => moveColumnUp(index)}
                className={`p-1 rounded ${
                  index === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <ArrowUp size={20} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: index === columns.length - 1 ? 1 : 1.2 }}
                disabled={index === columns.length - 1}
                onClick={() => moveColumnDown(index)}
                className={`p-1 rounded ${
                  index === columns.length - 1
                    ? "opacity-30 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <ArrowDown size={20} />
              </motion.button>

              {/* Delete button */}
              <motion.button
                type="button"
                whileHover={{ scale: columns.length > 3 ? 1.2 : 1 }}
                disabled={columns.length <= 3}
                onClick={() => deleteColumn(index)}
                className={`p-1 rounded ${
                  columns.length <= 3 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <Trash2 size={20} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-between">
        <motion.button
          type="button"
          onClick={addColumn}
          whileHover={{ scale: 1.1 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          Add Column
        </motion.button>
      </div>

      <div className="flex justify-end space-x-4">
        <motion.button
          type="button"
          onClick={() => closeModal()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          Save
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EditColumn;
