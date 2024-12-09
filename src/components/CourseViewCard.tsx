import React from "react";

import { Course } from "~/api";

interface CourseCardProps {
  course: Course;
}

const CourseViewCard: React.FC<CourseCardProps> = ({ 
  course
}) => {
  return (
    <div className="bg-white shadow-md rounded-3xl p-4 w-full">
        <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
            <h3 className="text-2xl font-bold text-black m-2 mb-4 text-left">{course.name}</h3>
            <button className="block text-xl w-1/3 m-4 h-10 p-2 rounded-lg text-white text-center text-bold bg-purple-600">
                Programme
            </button>
        </div>
        <p className="m-2 pl-4">Semester: {course.semester}</p>
        <p className="m-2 pl-4">{course.credits} ECTS credits</p>
        <p className="m-2 pl-4">{course.educational_level}</p>
        <p className="m-2 pl-4">{course.description}</p>
        <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
            <p className="m-2 pl-4">{course.code}</p>       
        </div>
    </div>
  );
};

export default CourseViewCard;
