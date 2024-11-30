import { useState } from "react";

import { useNavigate } from "react-router-dom";

import CourseViewCard from "./CourseViewCard";

import { Course, ValidRequisitesResponse } from "~/api";


interface StudyPlanViewParams {
    id: string
    name: string | undefined,
    courses: Course[],
    validation: ValidRequisitesResponse
}

const StudyPlanView: React.FC<StudyPlanViewParams> = ({ id, name, courses, validation}) => {

    const totalCredits = courses.reduce((acc, current) => parseFloat(current.credits) + acc, 0);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    return(
        <div className="flex flex-row max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <main id="planning-content" className="bg-neutral-300 rounded-3xl max-h-full p-4 m-8">
                    <div className="flex items-center justify-between p-8">
                        <div id="study-info" className="text-2xl flex flex-col space-y-4">
                            <h2 className="font-bold text-4xl">{name}</h2>
                            <p className="">{courses.length} courses selected</p>
                            <p className="">{totalCredits} ECTS credits total</p>
                            {
                                validation.is_valid
                                ? <p>All courses meet the requirements</p>
                                : (
                                    <div>
                                        <label htmlFor="valid-details-button" className="text-[#DD0000]">Not all courses meet the requirements</label>
                                        <button
                                            id="valid-details-button"
                                            onClick={handleModalOpen}
                                            className="ml-6 text-white bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2"
                                        >
                                            See details
                                        </button>
                                    </div>
                                  )
                            }

                        </div>
                        <div id="action-buttons" className="flex flex-col text-3xl text-white space-y-2">
                            <button
                                onClick={() => navigate(`/edit-study-plan/${id}`)}
                                className="bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2">
                                Edit Plan
                            </button>
                            <button className="bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2">
                                View Schedule
                            </button>
                            <button className="bg-purple-500 hover:bg-purple-700 rounded-lg w-auto p-2">
                                View Selected Courses
                            </button>
                        </div>
                    </div>
                    <hr className="border-black m-4" />
                    <div className="flex flex-col gap-y-4">
                        {
                            courses.length > 0
                            ? courses.map((course) => (
                                <CourseViewCard
                                    key={course.id}
                                    name={course.name}
                                    credits={course.credits} 
                                    code={course.code} 
                                    educational_level={course.educational_level} 
                                    description={course.description}
                                />
                            ))
                            : <p>You don't have any course selected</p>
                        }
                    </div>
                </main>
                {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 w-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-auto">
                        <h2 className="text-3xl font-bold text-center mb-4">Requierements needed</h2>
                        <hr className="border-black m-2" />
                        <table className="text-2xl border-separate border-spacing-6">
                            <tr>
                                <th>To course</th>
                                <th>{""}</th>
                                <th>You must course</th>
                            </tr>
                            {
                                validation.not_satisfied_prerequisites.map((pair) => (
                                    <tr>
                                        <td>{pair.course}</td>
                                        <td className="text-6xl">{"→"}</td>
                                        <td>{pair.prerequisite}</td>
                                    </tr>
                                ))
                            }
                        </table>
                        <hr className="border-black m-2" />
                        <div className="flex justify-between mt-4 px-52">
                            <button
                                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700 text-2xl"
                                onClick={handleModalClose}
                            >
                                Close
                            </button>

                            <button
                                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 text-2xl"
                                disabled
                            >
                                Add courses
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}

export default StudyPlanView;