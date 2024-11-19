import React, { useEffect, useState } from "react";

import { client, getAllStudyPlans, StudyPlan, StudyPlanGetResponse } from "~/api";
import StudyPlanCard from "~/components/StudyPlanCard";


function Dashboard() {
    
    const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
    // const [user, setUser] = useState({});

    useEffect(() => {
        async function getStudyPlans() {
            const response = await client.get<StudyPlanGetResponse>("/v1/study-plans");
            setStudyPlans(response.data.results);
            console.log(studyPlans);
        }

        getStudyPlans();
    }, [])


    return(
        <div className="flex flex-row max-h-full max-w-full">
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
                    {studyPlans.length > 0 ? (
                        <div  id="study-plan" className="flex space-x-8 p-4">
                            {studyPlans.map((studyPlan) => (
                                <StudyPlanCard
                                    id={studyPlan.id}
                                    name={studyPlan.name}
                                    completed={studyPlan.status === "draft"}
                                    numCourses={studyPlan.courses.length}
                                    lastUpdate={studyPlan.updated_at.slice(0, 10)}
                                    />
                            ))}
                        </div>
                    ) : (
                        <p className="text-2xl text-gray-600 text-center m-36">
                            You don't have any study plan yet
                        </p>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Dashboard