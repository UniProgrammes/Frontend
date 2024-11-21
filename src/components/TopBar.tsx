import React, { useState } from "react"

import { BellIcon, ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

import LoginModalBody from "~/components/LoginModalBody";
import RegisterModalBody from "~/components/RegisterModalBody";
import useMainStore from "~/stores/mainStore";


function TopBar() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const { isLoggedIn, user, setIsLoggedIn, setAccessToken, setUser } = useMainStore();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      navigate("/profile");
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setUser(null);
    message.success("Logged out successfully");
  }

  return (
    <div className="flex items-center justify-end gap-4 px-8 bg-neutral-300 py-2 rounded-b-md">
      <button className="bg-white rounded-2xl px-4 py-2 shadow-md flex items-center gap-2" onClick={handleProfileClick}>
        {isLoggedIn ? user?.firstName : "Login"}
        <PersonIcon />
      </button>
      <button className="bg-white w-auto h-auto rounded-2xl text-2xl p-4 shadow-md">
        <BellIcon />
      </button>
      {isLoggedIn && (
        <button className="bg-white w-auto h-auto rounded-2xl text-2xl p-4 shadow-md group relative" onClick={handleLogout}>
          <ExitIcon />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Logout
          </span>
        </button>
      )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          centered
          footer={null}
          maskClosable={false}
          classNames={{
            mask: "backdrop-blur-sm"
            }}
          >
            {modalType === "login" && <LoginModalBody setModalType={setModalType} close={() => setIsModalOpen(false)} />}
            {modalType === "register" && <RegisterModalBody setModalType={setModalType} />}
          </Modal>
      )}
    </div>
  )
}

export default TopBar;
