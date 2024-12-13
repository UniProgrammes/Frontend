import React from "react";

import { FaPencilAlt, FaEye, FaTrashAlt } from 'react-icons/fa';

interface StudyPlanCardProps {
    id: string,
    name: string,
    completed: boolean;
    numCourses: number;
    lastUpdate: string;
    onDelete: (id: string) => void;
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ id, name, completed, numCourses, lastUpdate, onDelete  }) => {
  
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this study plan?")) {
        onDelete(id); 
    }
  };
  return (
    <div id={id} className="bg-white shadow-md rounded-3xl p-4 w-fit">
      <h3 className="text-lg font-bold text-white p-4 my-2 rounded-2xl bg-purple-500 text-center">{name}</h3>
      <p className="m-2 mt-8">{completed ? "" : "Not"} Completed</p>
      <p className="m-2"> {numCourses} courses selected</p>
      <p className="m-2 mb-8">Last Updated on: {lastUpdate}</p>
      <button 
          onClick={() => {navigate(`/study-plan/${id}`)}}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-full text-center w-full">
          {completed ? (
              <FaEye className="h-6 w-6 text-white" />
          ) : (
              <FaPencilAlt className="h-6 w-6 text-white" />
          )}
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-full text-center w-full mt-4">
          <FaTrashAlt className="h-6 w-6 text-white" />
      </button>
    </div>
  )
}

export default StudyPlanCard;
