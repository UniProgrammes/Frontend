import React from "react";

import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface StudyPlanCardProps {
  id: string;
  name: string;
  completed: boolean;
  numCourses: number;
  lastUpdate: string;
  onDelete: (id: string) => void;
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({
  id,
  name,
  completed,
  numCourses,
  lastUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this study plan?")) {
      onDelete(id);
    }
  };

  return (
    <div
      id={id}
      className="bg-white shadow-md rounded-3xl p-3 w-full flex items-center justify-between"
    >
      <div className="flex flex-col w-2/5">
        <h3 className="text-lg font-bold text-white p-1 my-1 rounded-2xl bg-purple-500 text-center">
          {name}
        </h3>
        <p className="m-1 mt-4">{completed ? "" : "Not"} Completed</p>
        <p className="m-1">Courses Selected: {numCourses}</p>
        <p className="m-1 mb-4">Last Updated on: {lastUpdate}</p>
      </div>

      <div className="flex flex-col w-1/7 space-y-2 justify-end items-end">
        <button
          onClick={() => {
            navigate(`/study-plan/${id}`);
          }}
          className="flex items-center justify-center px-3 py-2 bg-purple-400 hover:bg-purple-600 text-white rounded-full w-full"
        >
          {completed ? (
            <>
              <FaEye className="mr-2" /> View
            </>
          ) : (
            <>
              <FaPencilAlt className="mr-2" /> Modify
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-800 text-white rounded-full w-full"
        >
          <MdDelete className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default StudyPlanCard;
