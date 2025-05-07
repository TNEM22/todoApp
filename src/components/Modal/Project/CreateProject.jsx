import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { setProjects } from "../../../store/slices/projectSlice";

import { SERVER_URL } from "../../../Constants";

const CreateProject = ({ closeModal }) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.features["PROJECTS"]);
  const [title, setTitle] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const url = `${SERVER_URL}/api/v1/projects/`;
    toast.promise(
      axios
        .post(
          url,
          { title: title },
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
            dispatch(
              setProjects({
                ...projects,
                [dd.data._id]: {
                  id: dd.data._id,
                  title: dd.data.title,
                  count: -1,
                  columns: dd.data.columns,
                  isActive: false,
                },
              })
            );
            closeModal();
          }
        })
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        }),
      {
        pending: "Creating project...",
        success: "Project created!",
        error: "Cannot create project!",
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
          Project Title
        </label>
        <motion.input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

export default CreateProject;
