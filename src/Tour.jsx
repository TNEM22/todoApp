import React, { useEffect } from "react";
import { driver } from "driver.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setShowProjectsDropdown,
  setProjectsSelectedCategory,
} from "./store/slices/operationSlice";

const Tour = () => {
  const dispatch = useDispatch();

  const navSteps = [
    {
      popover: {
        title: "Take a Tour",
        description: "Start the tour to explore the features.",
      },
    },
    {
      element: "#nav-panel",
      popover: {
        title: "Navigation Panel",
        description: "Navigate to through different pages.",
        align: "center",
      },
    },
    {
      element: "#logout-btn",
      popover: {
        title: "Logout Button",
        description: "Click here to log out.",
      },
    },
  ];

  const menuBarSteps = [
    {
      element: "#theme-switch",
      popover: {
        title: "Change Theme",
        description: "Try changing theme!",
        side: "top",
      },
    },
    {
      element: "#menu-bar",
      popover: {
        title: "Menu Bar",
        description: "Here's where you will manage projects and teams.",
        align: "center",
      },
    },
    {
      element: "#create-project-btn",
      popover: {
        title: "Manage Team/Projects",
        description:
          "Create Projects, Manage Team (Teams Currently Not Available!)",
        side: "bottom",
      },
      onHighlightStarted: () => {
        dispatch(setShowProjectsDropdown(true));
        dispatch(setProjectsSelectedCategory("Project"));
      },
    },
    {
      element: "#projects-dropdown",
      popover: {
        title: "Create Project",
        side: "bottom",
      },
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token") || !localStorage.getItem("name")) {
      navigate("/login");
      return;
    }

    if (localStorage.getItem("tour") === "true") return;
    // localStorage.setItem("tour", "true");

    const steps = [...navSteps, ...menuBarSteps];

    const driverObj = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps,
      allowClose: true,
    });

    driverObj.drive();
  }, []);
};

export default Tour;
