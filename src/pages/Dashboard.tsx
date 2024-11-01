import React from "react";

function Dashboard() {
    return(
        <div className="">
            <nav id="side-bar" className="bg-purple-500 w-1/5 h-screen">
                <h1 className="p-8 pl-4 text-4xl text-white font-bold justify-center">
                    UniProgrammes
                </h1>
                <div>
                    <h2 className="m-4 text-white">
                        MENU
                    </h2>
                    <ul>
                        <button className="block w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-700">Dashboard</button>
                        <button className="block w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-700">Create Plan</button>
                        <button className="block w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-700">View Programme & Courses</button>
                        <button className="block w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-700">Profile</button>
                        <button className="block w-11/12 m-4 h-10 text-left p-2 rounded-lg text-white bg-purple-700">Help</button>
                    </ul>
                </div>
                <button className="absolute bottom-4 left-4 bg-neutral-600 text-white rounded-lg w-24 h-12">
                    EN
                </button>
            </nav>
            <div id="main-content">
                <header id="top-buttons">
                    <button id="user-identifier">
                        User
                    </button>
                    <button id="notifications-button">
                        Notifications
                    </button>
                </header>
                <main id="planning-content">
                    <div>
                        <button>Draft Study Plans</button>
                        <button>Completed Study Plans</button>
                        <div>
                            <img src="" alt=""/>
                            Sort By
                        </div>
                    </div>
                    <div id="study-plan">
                        
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard