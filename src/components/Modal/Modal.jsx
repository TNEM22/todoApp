// TODO: Use ludicde-react icons
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9 },
};

const Modal = ({ isOpen, onClose, children }) => {
  const title = children?.props?.title || "Untitled";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#2a2b2f7e] bg-opacity-50 z-50 flex justify-center items-center"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-[#2A2B2F] p-6 rounded-2xl shadow dark:shadow-white w-[90%] max-w-md relative text-black dark:text-white"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <IoClose size={30} />
              </button>
            </div>

            {/* Modal Body */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
