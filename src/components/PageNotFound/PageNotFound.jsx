import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  const theme = "light"; // you can replace this with your theme logic

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${
        theme === "dark" ? "bg-[#2A2B2F] text-white" : "bg-white text-black"
      }`}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="text-7xl font-extrabold mb-4"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        className="text-xl mb-8"
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-lg font-medium shadow-lg hover:bg-blue-700 transition"
        >
          Go Back to Dashboard
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default PageNotFound;
