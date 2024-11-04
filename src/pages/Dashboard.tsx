import React from "react";

import StudyPlanCard from "~/components/StudyPlanCard";

// Acces this page, change the url to .../dashboard

function Dashboard() {
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
                    <div id="navigantion-buttons" className="flex flex-row items-center justify-between px-32 p-4">
                        <button className="text-2xl p-4 rounded-2xl hover:bg-purple-400">Draft Study Plans</button>
                        <button className="text-2xl p-4 rounded-2xl hover:bg-purple-400">Completed Study Plans</button>
                        <div className="flex flex-row bg-neutral-400 rounded-full w-40 p-2 items-center">
                            <img src="/vite.svg" alt="" className="m-2 mr-4"/>
                            <h3 className="h-full align-middle text-2xl">Sort By</h3>
                        </div>
                    </div>
                    <div id="study-plan" className="flex space-x-8 p-4">
                        <StudyPlanCard name="Study Plan 1" completed="" numCourses="5" lastUpdate="2024-03-02"/>
                        <StudyPlanCard name="Study Plan 2" completed="" numCourses="5" lastUpdate="2024-03-02"/>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard