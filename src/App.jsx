import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, Bounce } from "react-toastify";
import { motion } from "framer-motion";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      {isMobile ? (
        <div className="fixed top-0 left-0 z-50 flex flex-col h-full w-full items-center justify-center bg-[#1c1d22] text-white">
          <div className="flex gap-1 justify-center mb-4">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.3 }}
                className={`${
                  i === 1 ? "rotate-180 mt-3" : "mr-1"
                } drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)]`}
              >
                <motion.svg
                  width="30"
                  height="120"
                  viewBox="0 0 30 120"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  <polygon points="0,40 30,30 30,62 0,72" fill="#FFFFFF" />
                  <path
                    d="M0 70 L35 90"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="5"
                  />
                </motion.svg>
              </motion.div>
            ))}
          </div>
          <h1 className="text-xl text-shadow-md/30 text-shadow-white font-bold text-center">
            Mobile view is not supported!
          </h1>
        </div>
      ) : (
        <AppComponent />
      )}
    </Router>
  );
};

export default App;
