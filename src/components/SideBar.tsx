import React from "react";

import { Link, useLocation } from "react-router-dom";

const SideBar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/createplan", label: "Create Plan" },
    { path: "/view-programme", label: "View Programme & Courses" },
    { path: "/profile", label: "Profile" },
    { path: "/help", label: "Help" },
  ];

  return (
    <div className="w-64">
      <nav id="side-bar" className="bg-purple-500 h-screen flex flex-col">
        <h1 className="p-4 text-2xl text-white font-bold">
          UniProgrammes
        </h1>
        <div className="flex-1 mt-6">
          <h2 className="px-4 py-2 text-sm font-light text-white">MENU</h2>
          <ul className="flex flex-col gap-4 px-2">
            {menuItems.map((item) => (
              <Link 
                to={item.path} 
                key={item.path}
                className={`block text-sm w-full px-3 py-2 rounded-lg text-white ${
                  location.pathname === item.path ? "bg-purple-800" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </ul>
        </div>
        <button className="m-4 bg-neutral-800 text-white rounded-lg w-12 h-8 text-sm">
          EN
        </button>
      </nav>
    </div>
  );
};

export default SideBar;
