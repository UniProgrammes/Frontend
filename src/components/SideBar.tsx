import React from "react";

import { Tooltip } from "antd";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

import useMainStore from "~/stores/mainStore";

const SideBar: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn } = useMainStore();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", isPrivate: true },
    { path: "/createplan", label: "Create Plan" },
    { path: "/view-programme", label: "View Programme & Courses" },
    { path: "/profile", label: "Profile", isPrivate: true },
    { path: "/help", label: "Help" },
  ];

  return (
    <div className="w-64">
      <nav id="side-bar" className="bg-purple-500 h-screen flex flex-col">
        <h1 className="text-2xl text-white font-bold flex items-center justify-center h-20">
          UniProgrammes
        </h1>
        <div className="flex-1 mt-6">
          <h2 className="px-4 py-2 text-sm font-light text-white">MENU</h2>
          <ul className="flex flex-col gap-4 px-2">
            {menuItems.map((item) => (
              <Tooltip
                key={item.path}
                title={item.isPrivate && !isLoggedIn ? "Please login to access this feature" : ""}
                placement="right"
              >
                <Link
                  to={item.isPrivate && !isLoggedIn ? "#" : item.path}
                  className={clsx(
                    "block text-sm w-full px-3 py-2 rounded-lg text-white",
                    location.pathname === item.path ? "bg-purple-800" : "bg-purple-600 hover:bg-purple-700",
                    item.isPrivate && !isLoggedIn && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {item.label}
                </Link>
              </Tooltip>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
