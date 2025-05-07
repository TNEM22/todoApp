import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, Bounce } from "react-toastify";

import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

import MenuBar from "./components/MenuBar/MenuBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Workspace from "./components/Workspace/Workspace";
import PageNotFound from "./components/PageNotFound/PageNotFound";

const AppComponent = () => {
  const location = useLocation();

  return (
    <div className="fixed flex h-full w-full font-exo-2">
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route
            path="/"
            element={
              <>
                <ToastContainer
                  position="top-right"
                  autoClose={1000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover={false}
                  theme="dark"
                  transition={Bounce}
                />
                <Outlet />
              </>
            }
          >
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />

            <Route path="" element={<DashboardPage />}>
              <Route
                path=""
                element={
                  <>
                    <MenuBar />
                    <Dashboard animate>
                      <Workspace />
                    </Dashboard>
                  </>
                }
              />
              <Route path="me" element={<Dashboard>User Page</Dashboard>} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppComponent />
    </Router>
  );
};

export default App;
