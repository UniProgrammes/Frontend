import React from "react";

  const SideBar: React.FC = () => {
  return (
    <div className="w-auto">
      <nav id="side-bar" className="bg-purple-500 w-auto h-screen">
        <h1 className="p-8 pl-4 text-4xl text-white font-bold justify-center">
            UniProgrammes
        </h1>
        <div>
            <h2 className="m-4 text-white">
                MENU
            </h2>
            <ul className="flex flex-col">
                <button className="block text-xl w-11/12 m-4 h-auto text-left p-3 rounded-lg text-white bg-purple-800">Dashboard</button>
                <button className="block text-xl w-11/12 m-4 h-auto text-left p-3 rounded-lg text-white bg-purple-600">Create Plan</button>
                <button className="block text-xl w-11/12 m-4 h-auto text-left p-3 rounded-lg text-white bg-purple-600">View Programme & Courses</button>
                <button className="block text-xl w-11/12 m-4 h-auto text-left p-3 rounded-lg text-white bg-purple-600">Profile</button>
                <button className="block text-xl w-11/12 m-4 h-auto text-left p-3 rounded-lg text-white bg-purple-600">Help</button>
            </ul>
        </div>
        <button className="absolute bottom-4 left-4 bg-neutral-800 text-white rounded-lg w-24 h-12">
            EN
        </button>
    </nav>
    </div>
  )
}

export default SideBar;
