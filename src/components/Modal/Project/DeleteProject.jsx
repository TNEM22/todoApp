import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  setProjects,
  setSelectedProject,
  setTasks,
} from "../../../store/slices/projectSlice";

import { SERVER_URL } from "../../../Constants";

const DeleteProject = ({ closeModal }) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.features["PROJECTS"]);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const title = projects?.[selectedProject]?.title;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const url = `${SERVER_URL}/api/v1/projects/`;
    toast.promise(
      axios
        .delete(url, {
          data: { id: selectedProject },
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((response) => {
          const dd = response.data;
          if (dd.status === "error") {
            throw new Error();
          } else {
            const newProjects = { ...projects };
            delete newProjects[selectedProject];
            dispatch(setProjects(newProjects));
            dispatch(setSelectedProject(null));
            dispatch(setTasks([]));
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
      <div>
        <label htmlFor="title" className="block text-lg font-medium mb-1">
          Are you sure you want to delete this project?
        </label>
        <motion.input
          type="text"
          name="title"
          id="title"
          value={title || ""}
          readOnly
          placeholder="Type your project title..."
          required
          className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex justify-end">
        <motion.button
          type="button"
          onClick={() => {
            closeModal();
          }}
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
          className="ml-4 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          Confirm
        </motion.button>
      </div>
    </motion.form>
  );
};

export default DeleteProject;
