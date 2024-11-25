import { useNavigate } from "react-router-dom";

import CourseViewCard from "./CourseViewCard";

import { Course } from "~/api";


interface StudyPlanViewParams {
    id: string
    name: string | undefined,
    courses: Course[],
    meetRequirements: boolean
}

const StudyPlanView: React.FC<StudyPlanViewParams> = ({ id, name, courses, meetRequirements}) => {

    const totalCredits = courses.reduce((acc, current) => parseFloat(current.credits) + acc, 0);
    const navigate = useNavigate();

    return(
        <div className="flex flex-row max-h-screen max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <main id="planning-content" className="bg-neutral-300 rounded-3xl h-screen p-4 m-8">
                    <div className="flex items-center justify-between p-8">
                        <div id="study-info" className="text-2xl flex flex-col space-y-4">
                            <h2 className="font-bold text-4xl">{name}</h2>
                            <p className="">{courses.length} courses selected</p>
                            <p className="">{totalCredits} ECTS credits total</p>
                            <p className="">{`${meetRequirements
                                                ? "All courses meet the requirements"
                                                : "Not all courses meet the requirements"}`}</p>
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
                            courses.map((course) => (
                                <CourseViewCard
                                    key={course.id}
                                    name={course.name}
                                    credits={course.credits} 
                                    code={course.code} 
                                    educational_level={course.educational_level} 
                                    description={course.description} />
                            ))
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudyPlanView;