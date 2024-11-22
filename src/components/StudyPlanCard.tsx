import React from "react";

interface StudyPlanCardProps {
    id: string,
    name: string,
    completed: boolean;
    numCourses: number;
    lastUpdate: string;
}

  const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ id, name, completed, numCourses, lastUpdate }) => {
  return (
    <div id={id} className="bg-white shadow-md rounded-3xl p-4 w-fit">
      <h3 className="text-lg font-bold text-white p-4 my-2 rounded-2xl bg-purple-500 text-center">{name}</h3>
      <p className="m-2 mt-8">{completed ? "" : "Not"} Completed</p>
      <p className="m-2"> {numCourses} courses selected</p>
      <p className="m-2 mb-8">Last Updated on: {lastUpdate}</p>
      <a href="http://localhost:3000/study-plan">
        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-full text-center w-full">
          {completed ? "View" : "Modify"} Study Plan
        </button>
      </a>
    </div>
  )
}

export default StudyPlanCard;
