import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { driver } from "driver.js";

import { FaAngleDown } from "react-icons/fa6";

import {
  setTeam,
  setProjects,
  setTasks,
  setReminders,
  setMessengers,
  setSelectedProject,
} from "../../store/slices/projectSlice";

import {
  setShowSortDropdown,
  setShowManageDropdown,
} from "../../store/slices/operationSlice";

import { SERVER_URL } from "../../Constants";

const Features = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.features["PROJECTS"]);
  const tasks = useSelector((state) => state.project.features["TASKS"]);

  // useEffect(() => console.log("Tasks:", tasks), [tasks]);

  const [features, setFeatures] = useState({
    TEAM: { title: "Team", isActive: false },
    PROJECTS: { title: "Projects", isActive: false },
    TASKS: { title: "Tasks", isActive: false },
    REMINDERS: { title: "Reminders", isActive: false },
    MESSENGERS: { title: "Messengers", isActive: false },
  });

  const useFeatureTrigger = (obj, key) => {
    useEffect(() => {
      if (Object.keys(obj).length === 0) {
        setFeatures((prev) => ({
          ...prev,
          [key]: { ...prev[key], isActive: false },
        }));
      } else {
        setFeatures((prev) => ({
          ...prev,
          [key]: { ...prev[key], isActive: true },
        }));
      }
    }, [obj, key]);
  };

  // Projects Trigger
  // useFeatureTrigger(projects, "PROJECTS");
  useEffect(() => {
    if (Object.keys(projects).length === 0) {
      setFeatures((prev) => ({
        ...prev,
        PROJECTS: { ...prev.PROJECTS, isActive: false },
      }));
    } else {
      setFeatures((prev) => ({
        ...prev,
        PROJECTS: { ...prev.PROJECTS, isActive: true },
      }));

      if (localStorage.getItem("tour") === "true") return;
      // If no project is selected yet, pick the first one
      const projectId = Object.keys(projects)[0];
      dispatch(setSelectedProject(projectId || null));
      localStorage.setItem("tour", "true");
      const driverObj = driver({
        popoverClass: "driverjs-theme",
        showProgress: true,
        steps: [
          {
            element: "#PROJECTS",
            popover: {
              title: "Select Project",
              description: "Open dashboard by selecting project",
              align: "center",
            },
            onHighlightStarted: () => {
              const tasks = projects[projectId].columns?.reduce(
                (acc, column) => {
                  acc.push({
                    _id: column._id,
                    id: column._id,
                    title: column.title,
                    count: 0,
                    isActive: false,
                  });
                  return acc;
                },
                []
              );
              dispatch(setTasks(tasks));
            },
          },
          {
            element: "#TASKS",
            popover: {
              title: "View all your tasks at a glance",
              description:
                "Organized by default status: To Do, In Progress, and Done.",
              align: "center",
            },
          },
          {
            element: "#task-status-column",
            popover: {
              title: "Task Status Column",
              align: "center",
            },
          },
          {
            element: "#add-views",
            popover: {
              title: "Select View",
              description: "Switch views to organize tasks your way.",
            },
          },
          {
            element: "#dropdown-btn",
            popover: {
              title: "Filter & Arrange Tasks (Drag-n-Drop)",
              description:
                "Click to toggle drag-and-drop for quick task sorting.",
            },
          },
          {
            element: "#sort-btn",
            popover: {
              title: "Sort tasks",
            },
            onHighlightStarted: () => {
              dispatch(setShowSortDropdown(true));
            },
          },
          {
            element: "#sort-options",
            popover: {
              title: "Sorting Options",
            },
            onDeselected: () => {
              dispatch(setShowSortDropdown(false));
            },
          },
          {
            element: "#manage-projects-columns",
            popover: {
              title: "Manage project & columns",
            },
            onHighlightStarted: () => {
              dispatch(setShowManageDropdown(true));
            },
          },
          {
            element: "#projects-columns-options",
            popover: {
              title: "Manage project & columns",
            },
            onDeselected: () => {
              dispatch(setShowManageDropdown(false));
            },
          },
          {
            popover: {
              title: "🎉Congratulations Tour Ended!",
              description: "Thank you for completing the tour.",
            },
          },
        ],
        allowClose: true,
      });

      driverObj.drive();
    }
  }, [projects]);

  // Tasks Trigger
  useFeatureTrigger(tasks, "TASKS");

  const project = useSelector((state) => state.project.features["PROJECTS"]);

  // Initialize Projects
  useEffect(() => {
    if (
      localStorage.token &&
      localStorage.name &&
      Object.keys(project).length === 0
    ) {
      const url = `${SERVER_URL}/api/v1/projects/`;
      toast.promise(
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${localStorage.token}`,
            },
          })
          .then((response) => {
            const dd = response.data;
            const projects = {};

            dd.data.forEach((item) => {
              projects[item._id] = {
                id: item._id,
                title: item.title,
                columns: item.columns,
                count: -1,
                isActive: false,
              };
            });

            dispatch(setProjects(projects));
          })
          .catch((err) => {
            console.error(err);
            throw new Error(err);
          }),
        {
          pending: "Loading projects...",
          success: "Projects loaded!",
          error: "Cannot load projects!",
        }
      );
    }
  }, [dispatch]);

  return (
    <div className="flex-1 mt-6 flex flex-col gap-4">
      {Object.keys(features).map((item) => (
        <Item key={item} id={item} item={features[item]} />
      ))}
    </div>
  );
};

const Item = ({ id, item }) => {
  const project = useSelector((state) => state.project.features[id]);
  // useEffect(() => {
  //   if (id === "TASKS") {
  //     console.log("Project:", project);
  //   }
  // }, [id, project]);

  function getUniqueCount() {
    let count = 0;
    for (let element in project) {
      if (project[element].count === -1) return Object.keys(project).length;
      else count += project[element].count;
    }
    return count;
  }

  return (
    <div id={id} className="w-full">
      <div
        className={
          "flex justify-between items-center " +
          (!item.isActive && "text-[#1C1D2280] dark:text-[#FFFFFF80]")
        }
      >
        <span>{item.title}</span>
        <span>
          <FaAngleDown
            size={16}
            className={
              "transition-transform " + (!item.isActive && "-rotate-90")
            }
          />
        </span>
      </div>
      {/* Data */}
      <div className="project-list flex flex-col gap-2 mt-3 font-semibold">
        {Object.keys(project).length !== 0 && (
          <div className="project-list-element dark:text-[#FFFFFF80] text-[#1C1D2280]">
            <span className="ml-4 px-5 py-1 cursor-pointer">
              All {item.title.toLowerCase()} ({getUniqueCount()})
            </span>
          </div>
        )}
        {/* <ItemComponent id={id} project={project} /> */}
        <ItemComponent id={id} />
      </div>
    </div>
  );
};

const ItemComponent = ({ id }) => {
  const dispatch = useDispatch();
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const project = useSelector((state) => state.project.features[id]); // <-- GET FROM REDUX HERE

  function setProject(projectId) {
    if (id === "TASKS") return;
    if (id === "PROJECTS") {
      dispatch(setSelectedProject(projectId));
      const tasks = project[projectId].columns?.map((column) => ({
        _id: column._id,
        id: column._id,
        title: column.title,
        count: 0,
        isActive: false,
      }));
      dispatch(setTasks(tasks));
    }

    const newProjects = {};
    Object.keys(project).forEach((item) => {
      newProjects[item] = { ...project[item], isActive: item === projectId };
    });

    switch (id) {
      case "TEAM":
        dispatch(setTeam(newProjects));
        break;
      case "PROJECTS":
        dispatch(setProjects(newProjects));
        break;
      case "REMINDERS":
        dispatch(setReminders(newProjects));
        break;
      case "MESSENGERS":
        dispatch(setMessengers(newProjects));
        break;
    }
  }

  return (
    <>
      {Object.keys(project).map((item) => {
        return (
          <div
            key={item}
            className={
              "project-list-element " +
              (item !== selectedProject
                ? !project[item].isActive &&
                  "dark:text-[#FFFFFF80] text-[#1C1D2280]"
                : "")
            }
          >
            <span
              onClick={() => setProject(item)}
              className={
                "ml-4 px-5 py-1 cursor-pointer rounded-full " +
                (item === selectedProject
                  ? "bg-[#e5e5e565] dark:bg-[#FFFFFF0A]"
                  : project[item].isActive &&
                    "bg-[#e5e5e565] dark:bg-[#FFFFFF0A]")
              }
            >
              {project[item].title}
              {id === "TASKS" && ` (${project[item].count})`}
            </span>
          </div>
        );
      })}
    </>
  );
};

// const ItemComponent = ({ id, project }) => {
//   const dispatch = useDispatch();
//   const projects = useSelector((state) => state.project.features["PROJECTS"]);
//   // console.log("Id:", id, "Project:", project);

//   function setProject(projectId) {
//     if (id === "TASKS") return;
//     if (id === "PROJECTS") {
//       dispatch(setSelectedProject(projectId));
//       const tasks = projects[projectId].columns?.reduce((acc, column) => {
//         acc.push({
//           _id: column._id,
//           id: column._id,
//           title: column.title,
//           count: 0,
//           isActive: false,
//         });
//         return acc;
//       }, []);
//       // console.log("Tasks:", tasks);
//       dispatch(setTasks(tasks));
//     }
//     const newProjects = {};

//     Object.keys(project).forEach((item) => {
//       newProjects[item] = { ...project[item], isActive: false };
//     });

//     newProjects[projectId].isActive = true;

//     switch (id) {
//       case "TEAM":
//         dispatch(setTeam(newProjects));
//         break;
//       case "PROJECTS":
//         dispatch(setProjects(newProjects));
//         break;
//       case "TASKS":
//         dispatch(setTasks(newProjects));
//         break;
//       case "REMINDERS":
//         dispatch(setReminders(newProjects));
//         break;
//       case "MESSENGERS":
//         dispatch(setMessengers(newProjects));
//         break;
//     }
//   }

//   return (
//     <>
//       {Object.keys(project).map((item) => (
//         <div
//           key={item}
//           className={
//             "project-list-element " +
//             (!project[item].isActive &&
//               "dark:text-[#FFFFFF80] text-[#1C1D2280]")
//           }
//         >
//           <span
//             onClick={() => setProject(item)}
//             className={
//               "ml-4 px-5 py-1 cursor-pointer rounded-full " +
//               (project[item].isActive && "bg-[#e5e5e565] dark:bg-[#FFFFFF0A]")
//             }
//           >
//             {project[item].title}&nbsp;
//             {/* {project[item].count !== -1 && `(${project[item].count})`} */}
//             {id === "TASKS" && `(${project[item].count})`}
//           </span>
//         </div>
//       ))}
//     </>
//   );
// };

export default Features;
