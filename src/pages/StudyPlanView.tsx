import React from "react";

function StudyPlanView() {
    return(
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
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