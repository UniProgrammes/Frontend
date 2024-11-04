import React from "react";

// Acces this page, change the url to .../dashboard

function StudyPlanView() {
    return(
        <div className="flex flex-row max-h-full max-w-full">
            <nav id="side-bar" className="bg-purple-500 w-1/5 h-screen">
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
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 w-auto h-auto rounded-2xl text-2xl p-4">
                        User
                    </button>
                    <button id="notifications-button" className="bg-neutral-300 w-auto h-auto rounded-2xl text-2xl p-4">
                        Notifications
                    </button>
                </header>
                <main id="planning-content" className="bg-neutral-300 rounded-3xl h-screen p-4 m-8">
                    <div className="flex items-center justify-between p-8">
                        <div id="study-info" className="text-2xl flex flex-col space-y-4">
                            <h2 className="font-bold text-4xl">Study Plan 1</h2>
                            <p className="">4 courses selected</p>
                            <p className="">35 ECTS credits total</p>
                            <p className="">All selected courses meet the requirements</p>
                        </div>
                        <div id="action-buttons" className="flex flex-col text-3xl text-white space-y-2">
                            <button className="bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2">Edit Plan</button>
                            <button className="bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2">View Schedule</button>
                            <button className="bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2">View Selected Courses</button>
                        </div>
                    </div>
                    <hr className="border-black m-4" />
                </main>
            </div>
        </div>
    )
}

export default StudyPlanView