import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { SERVER_URL } from "../../Constants";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.token && localStorage.name) {
      // document.cookie = `token=${localStorage.token}; path=/`;
      navigate("/");
    }
  });

  function handleFormSubmit(e) {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      const url = `${SERVER_URL}/api/v1/users/login`;
      toast.promise(
        axios
          .post(url, {
            email: email.trim(),
            password: password.trim(),
          })
          .then((res) => {
            const dd = res.data;
            setEmail("");
            setPassword("");

            if (dd.status === "success") {
              localStorage.setItem("token", dd.token);
              localStorage.setItem("name", dd.data.firstname);
              navigate("/");
            } else {
              if (typeof dd.message === "object") {
                for (const key in dd.message) {
                  toast.error(dd.message[key].message);
                }
                dd.message = "Something went wrong!";
              }

              throw new Error(dd.message || "Something went wrong!");
            }
          }),
        {
          pending: "Logining In...",
          success: "Logged In!",
          error: {
            render({ data }) {
              return data.message;
            },
          },
        }
      );
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="fixed h-full w-full flex justify-center items-center bg-[#2A2B2F] text-white">
      <motion.div
        exit={{ opacity: 0, scale: 0.2 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          scale: { type: "spring", duration: 0.5, bounce: 0.4 },
        }}
        className="shadow rounded-xl w-[350px] p-6 bg-[#1F2023] shadow-white"
      >
        {/* Animated Icons */}
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

        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-bold text-3xl pb-2 mb-3 border-b border-slate-500"
        >
          Login
        </motion.h1>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Email Field */}
          <motion.div
            custom={1}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <label
              htmlFor="email"
              className="absolute text-sm -top-3 left-2 bg-[#1F2023] px-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              className="block w-full border border-slate-500 rounded-md p-2 bg-transparent placeholder:text-slate-400"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            custom={2}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <label
              htmlFor="password"
              className="absolute text-sm -top-3 left-2 bg-[#1F2023] px-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              required
              className="block w-full border border-slate-500 rounded-md p-2 bg-transparent placeholder:text-slate-400"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full font-bold mt-2 py-2 px-2 rounded-md cursor-pointer text-white bg-blue-500 active:bg-blue-600 shadow-md hover:shadow-blue-500 transition"
          >
            Submit
          </motion.button>

          {/* Signup Link */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Link
              to="/signup"
              className="block text-center font-bold mt-3 py-2 rounded-md cursor-pointer text-white bg-indigo-500 active:bg-indigo-600 shadow-md hover:shadow-indigo-500 transition"
            >
              Sign Up
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
