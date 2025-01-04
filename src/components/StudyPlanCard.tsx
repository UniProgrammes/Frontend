import React from "react";

import { Button, Popconfirm } from "antd";
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

  return (
    <div
      id={id}
      className="bg-white shadow-md rounded-xl p-3 flex items-center justify-between cursor-pointer"
      onClick={() => navigate(`/study-plan/${id}`)}
    >
      <div className="flex flex-col w-2/5">
        <h3 className="text-lg font-bold text-white p-1 my-1 rounded-lg bg-purple-500 text-center">
          {name}
        </h3>
        <p className="m-1 mt-4">{completed ? "" : "Not"} Completed</p>
        <p className="m-1">Courses Selected: {numCourses}</p>
        <p className="m-1 mb-4">Last Updated on: {lastUpdate}</p>
      </div>

      <div className="flex flex-col w-1/7 space-y-2">
        <Button
          color="primary"
          variant="solid"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-study-plan/${id}`);
          }}
          icon={completed ? <FaEye /> : <FaPencilAlt />}
          className="text-base bg-purple-400 hover:!bg-purple-600 w-full"
        >
          {completed ? "View" : "Modify"}
        </Button>
        <Popconfirm
          placement="top"
          title="Are you sure you want to delete this study plan?"
          description="This action cannot be undone."
          okText="Yes"
          cancelText="No"
          onConfirm={(e) => {
            e?.stopPropagation();
            onDelete(id);
          }}
          onCancel={(e) => e?.stopPropagation()}
        >
          <Button
            color="danger"
            variant="solid"
            className="text-base w-full"
            icon={<MdDelete />}
            onClick={(e) => e.stopPropagation()}
          >
            Delete
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default StudyPlanCard;
