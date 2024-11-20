import React from "react"

import { BellIcon, PersonIcon } from "@radix-ui/react-icons";

function TopBar() {
  return (
    <div className="flex items-center justify-end gap-4 px-8 bg-neutral-300 py-2 rounded-b-md">
      <button id="user-identifier" className="bg-white w-auto h-auto rounded-2xl text-2xl p-4 shadow-md">
        <PersonIcon />
      </button>
      <button id="notifications-button" className="bg-white w-auto h-auto rounded-2xl text-2xl p-4 shadow-md">
        <BellIcon />
      </button>
    </div>
  )
}

export default TopBar;
