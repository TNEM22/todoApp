import React from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";

import Modal from "../Modal/Modal";
import CreateProject from "../Modal/Project/CreateProject";
import EditProject from "../Modal/Project/EditProject";
import DeleteProject from "../Modal/Project/DeleteProject";
import AddTask from "../Modal/Task/AddTask";
import EditTask from "../Modal/Task/EditTask";
import EditColumn from "../Modal/Task_Column/EditColumn";

import { setIsModalOpen, setModalName } from "../../store/slices/modalSlice";

const Dashboard = ({ children, animate }) => {
  const dispatch = useDispatch();

  const isModalOpen = useSelector((state) => state.modal.isModalOpen);
  const modalName = useSelector((state) => state.modal.modalName);

  const closeModal = () => {
    dispatch(setIsModalOpen(false));
    dispatch(setModalName(null));
  };

  function getModal() {
    switch (modalName) {
      case "create-project":
        return <CreateProject title="Create Project" closeModal={closeModal} />;
      case "edit-project":
        return <EditProject title="Edit Project" closeModal={closeModal} />;
      case "delete-project":
        return <DeleteProject title="Delete Project" closeModal={closeModal} />;
      case "add-task":
        return <AddTask title="Add Task" closeModal={closeModal} />;
      case "edit-task":
        return <EditTask title="Edit Task" closeModal={closeModal} />;
      case "edit-columns":
        return <EditColumn title="Add/Edit Columns" closeModal={closeModal} />;
      default:
        return <div title="🚧Under Construction!🚧" />;
    }
  }

  return (
    <motion.div
      initial={animate && { marginLeft: -300 }}
      animate={animate && { marginLeft: 0 }}
      exit={animate && { marginLeft: -300 }}
      transition={animate && { duration: 0.3, ease: "linear" }}
      className="flex flex-1 w-full flex-col dark:text-white dark:bg-[#2A2B2F]"
    >
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {getModal()}
      </Modal>
      <Header />
      {children}
    </motion.div>
  );
};

export default Dashboard;
