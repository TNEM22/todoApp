import React from "react";
import { Outlet } from "react-router-dom";

import Tour from "../../Tour";

import NavigationPanel from "../../components/NavigationPanel/NavigationPanel";
import MenuBar from "../../components/MenuBar/MenuBar";

const DashboardPage = () => {
  return (
    <>
      <Tour />
      <NavigationPanel />
      <Outlet />
    </>
  );
};

export default DashboardPage;
