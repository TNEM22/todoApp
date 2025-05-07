import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { setProjectTasks } from "../../../store/slices/projectSlice";
import { SERVER_URL } from "../../../Constants";

const EditTask = ({ closeModal }) => {
  const dispatch = useDispatch();

  const taskColId = useSelector((state) => state.modal.taskColId);
  const taskState = useSelector((state) => state.modal.taskState);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const tasks = useSelector((state) => state.project.projectTasks);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [subTasks, setSubTasks] = useState("");
  const [selectDate, setSelectDate] = useState("");

  useEffect(() => {
    setTitle(taskState.title);
    setDesc(taskState.desc);
    setSubTasks(taskState.milestones.join(","));
    setSelectDate(taskState.assignedDate.split("T")[0]);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if ((!title.trim() || !desc.trim(), !subTasks.trim(), !selectDate.trim()))
      return;

    const url = `${SERVER_URL}/api/v1/projects/task`;
    toast.promise(
      axios
        .patch(
          url,
          {
            id: taskState.id,
            title: title,
            desc: desc,
            milestones: subTasks.split(","),
            completedMilestones: [],
            assignedDate: selectDate,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.token}`,
            },
          }
        )
        .then(() => {
          editTask(taskState.id, taskColId, {
            title: title,
            desc: desc,
            milestones: subTasks.split(","),
            completedMilestones: [],
            assignedDate: selectDate,
          });
          closeModal();
        })
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        }),
      {
        pending: "Updating tasks...",
        success: "Tasks updated!",
        error: "Cannot update tasks!",
      }
    );
  };

  const editTask = (taskId, colId, updatedFields) => {
    const columnTasks = tasks[selectedProject][colId];
    const updatedTasks = columnTasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    );

    const newTasks = {
      ...tasks,
      [selectedProject]: {
        ...tasks[selectedProject],
        [colId]: updatedTasks,
      },
    };

    dispatch(setProjectTasks(newTasks));
  };

  return (
    <motion.form
      onSubmit={handleFormSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <label htmlFor="title" className="block text-lg font-medium mb-1">
          Task Title
        </label>
        <motion.input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type your task title..."
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="desc" className="block text-lg font-medium mb-1">
          Task Description
        </label>
        <motion.textarea
          type="text"
          name="desc"
          id="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Set your task description..."
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="subtasks" className="block text-lg font-medium mb-1">
          Sub Tasks&nbsp;
          <span className="text-sm text-blue-300">
            (Separate subtasks by commas)
          </span>
        </label>
        <motion.input
          type="text"
          name="subtasks"
          id="subtasks"
          value={subTasks}
          onChange={(e) => setSubTasks(e.target.value)}
          placeholder="Define your subtasks..."
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="date" className="block text-lg font-medium mb-1">
          Completion date
        </label>
        <motion.input
          type="date"
          name="date"
          id="date"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
          placeholder="Type your project title..."
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          Submit
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EditTask;
