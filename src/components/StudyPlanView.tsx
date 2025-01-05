import { useState } from "react";

import { Button } from "antd";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Course, ValidCourses } from "~/api";
import CourseCard from "~/components/CourseCard";

interface StudyPlanViewParams {
  id: string;
  name: string | undefined;
  courses: Course[];
  validation: ValidCourses;
}

const StudyPlanView: React.FC<StudyPlanViewParams> = ({ id, name, courses, validation }) => {
  const totalCredits = courses.reduce((acc, current) => parseFloat(current.credits) + acc, 0);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const renderModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 w-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 w-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Requierements needed</h2>
          <hr className="border-black m-2" />
          <table className="text-2xl border-separate border-spacing-6">
            <thead>
              <tr>
                <th>To course</th>
                <th>{""}</th>
                <th>You must course</th>
              </tr>
            </thead>
            <tbody>
              {validation.not_satisfied_prerequisites.map((pair) => (
                <tr key={pair.course.id}>
                  <td>{pair.course.name}</td>
                  <td className="text-6xl">{"→"}</td>
                  <td>{pair.prerequisite.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="border-black m-2" />
          <div className="flex justify-between mt-4 px-10">
            <button
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700 text-2xl"
              onClick={handleModalClose}
            >
              Close
            </button>
            <button
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 text-2xl" 
              onClick={() => navigate(`/edit-study-plan/${id}`)}
            >
              Add courses
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="main-content" className="flex flex-col w-full">
      <main id="planning-content" className="bg-neutral-300 rounded-3xl max-h-full p-4 m-8">
        <div className="flex items-center justify-between p-8">
          <div id="study-info" className="text-xl flex flex-col space-y-2">
            <h2 className="font-bold text-3xl">{name}</h2>
            <p className="">Number of courses selected: {courses.length}</p>
            <p className="">Total credits added: {totalCredits}</p>
            {validation.is_valid ? (
              <p>All courses meet the requirements</p>
            ) : (
              <div>
                <label htmlFor="valid-details-button" className="text-red-600">
                  Not all courses meet the requirements
                </label>
                <button
                  id="valid-details-button"
                  onClick={handleModalOpen}
                  className="ml-6 text-white bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2"
                >
                  See details
                </button>
              </div>
            )}
          </div>
          <div id="action-buttons">
            <Button
              color="primary"
              variant="solid"
              onClick={() => navigate(`/edit-study-plan/${id}`)}
              className="text-xl bg-purple-500 hover:!bg-purple-600 w-full"
              size="large"
              icon={<FaPencilAlt />}
            >
              Edit Plan
            </Button>
          </div>
        </div>
        <hr className="border-black my-4" />
        <div className="grid grid-cols-3 gap-4">
          {courses.length > 0 && courses.map((course) => <CourseCard key={course.id} course={course} />)}
          {courses.length === 0 && <p className="col-span-3 text-2xl text-center m-36">You don't have any courses selected</p>}
        </div>
      </main>
      {modalOpen && renderModal()}
    </div>
  );
};

export default StudyPlanView;
