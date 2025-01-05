import React, { useEffect, useState } from "react";

import { message, Modal } from "antd";
import { HiUserCircle } from "react-icons/hi";
import { ImExit } from "react-icons/im";
import { useNavigate } from "react-router-dom";

import LoginModalBody from "~/components/LoginModalBody";
import RegisterModalBody from "~/components/RegisterModalBody";
import useMainStore from "~/stores/mainStore";

function TopBar() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const { isLoggedIn, user, setIsLoggedIn, setAccessToken, setUser } = useMainStore();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setUser(null);
    message.success("Logged out successfully");
  };

  useEffect(() => {
    if (isLoggedIn) {
      setIsModalOpen(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="flex items-center justify-between px-8 bg-white py-2 rounded-b-md">
      <button
        className="bg-gray-200 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-2"
        onClick={handleProfileClick}
      >
        <HiUserCircle size={24} /> {/* Ensure consistent size */}
        {isLoggedIn ? user?.firstName : "Login"}
      </button>

      {isLoggedIn && (
        <button
          className="bg-gray-200 w-auto h-auto rounded-2xl text-2xl p-4 shadow-sm group relative"
          onClick={handleLogout}
        >
          <ImExit size={24} /> {/* Ensure consistent size */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Logout
          </span>
        </button>
      )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onCancel={() => null}
          centered
          footer={null}
          maskClosable={false}
          classNames={{
            mask: "backdrop-blur-sm",
          }}
        >
          {modalType === "login" && (
            <LoginModalBody setModalType={setModalType} close={() => setIsModalOpen(false)} />
          )}
          {modalType === "register" && <RegisterModalBody setModalType={setModalType} />}
        </Modal>
      )}
    </div>
  );
}

export default TopBar;
