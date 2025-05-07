import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setTaskColId,
  setTaskState,
  setIsModalOpen,
  setModalName,
} from "../../store/slices/modalSlice";
import { setProjectTasks, setTasks } from "../../store/slices/projectSlice";

import Column from "./Column";
import { SERVER_URL } from "../../Constants";

const DragnDrop = () => {
  const dispatch = useDispatch();

  const selectedProject = useSelector((state) => state.project.selectedProject);
  const tasks = useSelector((state) => state.project.projectTasks);
  const columns = useSelector((state) => state.project.features["TASKS"]);
  const projects = useSelector((state) => state.project.features["PROJECTS"]);

  const containerRef = useRef();
  const [droppingItem, setDroppingItem] = useState(null);
  const [currentContainer, setCurrentContainer] = useState(null);

  // Tasks initialization
  useEffect(() => {
    if (!selectedProject || selectedProject === "undefined") return;
    if (tasks[selectedProject]) return;
    const id = projects[selectedProject].id;
    const url = `${SERVER_URL}/api/v1/projects/${id}/task`;
    toast.promise(
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((response) => {
          const dd = response.data;
          // Complete this...
          const newProjectTasks = columns.reduce((acc, col) => {
            acc[col.id] = [];
            return acc;
          }, {});

          const newTasks = {
            ...tasks,
            // [selectedProject]: {
            //   TODO: [],
            //   IN_PROGRESS: [],
            //   DONE: [],
            // },
            [selectedProject]: newProjectTasks,
          };
          // console.log("selectedProject:", selectedProject);
          // console.log("newTasks:", newTasks);
          // console.log("Data:", dd.data);
          // console.log("columns:", columns);
          dd.data.forEach((item) => {
            console.log("Item status:", item.status);
            newTasks[selectedProject][String(item.status)].push({
              id: item._id,
              title: item.title,
              desc: item.note,
              milestones: item.milestones,
              completedMilestones: item.completedMilestones,
              assignedDate: item.assignedDate,
              comments: item.comments,
              pinned: item.pinned,
              collaborators: item.collaborators,
              status: item.status,
            });
            // if (item.status === "TODO") {
            // }
          });

          dispatch(setProjectTasks(newTasks));

          // dispatch(
          //   setTasks({
          //     TODO: {
          //       title: "To do",
          //       count: projects[selectedProject]?.["TODO"]?.length || 0,
          //       isActive: false,
          //     },
          //     IN_PROGRESS: {
          //       title: "In progress",
          //       count: projects[selectedProject]?.["IN_PROGRESS"]?.length || 0,
          //       isActive: false,
          //     },
          //     DONE: {
          //       title: "Done",
          //       count: projects[selectedProject]?.["DONE"]?.length || 0,
          //       isActive: false,
          //     },
          //   })
          // );
        })
        .catch((err) => {
          console.error(err);
        }),
      {
        pending: "Loading tasks...",
        success: "Tasks loaded!",
        error: "Cannot load tasks!",
      }
    );
  }, [selectedProject, dispatch]);

  // Keep adjusting the numbers in MenuBar
  useEffect(() => {
    if (!selectedProject || !tasks || !tasks[selectedProject]) return;
    // const newColumns = [...columns];
    // Object.keys(currTasks).forEach((key) => {
    //   newColumns[key] = {
    //     ...columns[key],
    //     count: currTasks[key].length,
    //   };
    // });
    const currTasks = tasks[selectedProject];
    const newColumns = columns.map((col) => ({
      ...col,
      count: currTasks[col.id]?.length || 0,
    }));

    dispatch(setTasks(newColumns));
  }, [tasks, selectedProject]);

  const openTaskModal = (type) => {
    dispatch(setIsModalOpen(true));
    dispatch(setModalName(`${type}-task`));
  };

  const handleAddTask = (colId) => {
    dispatch(setTaskColId(colId));
    openTaskModal("add");
  };

  const handleEditTask = (colId, task) => {
    dispatch(setTaskColId(colId));
    dispatch(setTaskState(task));
    openTaskModal("edit");
  };

  const handleDeleteTask = (colId, taskId) => {
    const url = `${SERVER_URL}/api/v1/projects/task`;

    toast.promise(
      axios
        .delete(url, {
          data: {
            id: taskId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then(() => {
          deleteTask(taskId, colId);
        })
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        }),
      {
        pending: "Deleting task...",
        success: "Task deleted!",
        error: "Cannot delete task!",
      }
    );
  };

  const deleteTask = (taskId, colId) => {
    const newTasks = {
      ...tasks,
      [selectedProject]: {
        ...tasks[selectedProject],
        [colId]: tasks[selectedProject][colId].filter(
          (task) => task.id !== taskId
        ),
      },
    };
    dispatch(setProjectTasks(newTasks));
  };

  const handleDrop = (e, colId, idx) => {
    e.preventDefault();
    e.target.innerText = "Drag your task here...";

    const statusTitle = columns
      .find((col) => col.id === colId)
      .title.toLowerCase();
    // Update task status
    changeTaskStatus(colId, droppingItem.id, statusTitle);

    // Delete the task
    const newTasksAfterDelete = {
      ...tasks,
      [selectedProject]: {
        ...tasks[selectedProject],
        [droppingItem.status]: tasks[selectedProject][
          droppingItem.status
        ].filter((task) => task.id !== droppingItem.id),
      },
    };
    // console.log(colId, columns);
    // console.log(columns.find((col) => col.id === colId).title.toLowerCase());
    // Prepare the task to be added
    const updatedDroppingItem = {
      ...droppingItem,
      status: colId,
      ...(statusTitle === "done" && {
        completedMilestones: droppingItem.milestones,
      }),
    };

    // Add the task to the new column
    const columnTasks = [...newTasksAfterDelete[selectedProject][colId]];
    if (idx === -1) {
      columnTasks.push(updatedDroppingItem);
    } else {
      columnTasks.splice(idx, 0, updatedDroppingItem);
    }

    const newTasksAfterAdd = {
      ...newTasksAfterDelete,
      [selectedProject]: {
        ...newTasksAfterDelete[selectedProject],
        [colId]: columnTasks,
      },
    };

    // Dispatch the final state update
    dispatch(setProjectTasks(newTasksAfterAdd));

    // Reset drag/drop state
    currentContainer === null
      ? ""
      : (currentContainer.current.style.zIndex = 1);
    setCurrentContainer(null);
    setDroppingItem(null);
  };

  const changeTaskStatus = (newStatus, taskId, statusTitle) => {
    const url = `${SERVER_URL}/api/v1/projects/task/status`;
    axios
      .patch(
        url,
        { id: taskId, status: newStatus, statusTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      .then((response) => {
        const dd = response.data;
        if (dd.status === "error") {
          toast.error("Cannot update task!");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex-1 flex overflow-auto mx-5 my-3 gap-4 font-semibold whitespace-nowrap"
    >
      {tasks &&
        Object.keys(columns).map((column) => {
          const key = columns[column].id;

          return (
            <Column
              key={key}
              colId={key}
              tasks={tasks?.[selectedProject]?.[key]}
              addTask={handleAddTask}
              handleDrop={handleDrop}
              containerRef={containerRef}
              deleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
              title={columns?.[column]?.title}
              setDroppingItem={setDroppingItem}
              itemsLen={tasks?.[selectedProject]?.[key]?.length}
              setCurrentContainer={setCurrentContainer}
            />
          );
        })}
    </motion.div>
  );
};

export default DragnDrop;
