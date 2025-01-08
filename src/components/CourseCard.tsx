import React from "react";

import { TrashIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

import { Course } from "~/api";

interface CourseCardProps {
  course: Course;
  onRemove?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRemove }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md relative">
      <div className="absolute top-4 right-4 flex items-center justify-center gap-2">
        {course.year && <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Year: {course.year}</div>}
        {course.semester && <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Semester: {course.semester}</div>}
        {course.period && course.period < 3 && <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Period: {course.period}</div>}
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Course</div>
      </div>

      <h2 className="text-xl font-semibold text-blue-700 pr-24">{course.name}</h2>
      <div className="mt-2 text-neutral-600 grid grid-cols-2">
        <p>Code: {course.code}</p>
        <p>Credits: {course.credits}</p>
        <p>Level: {course.educational_level}</p>
        <p>Main Area: {course.main_area}</p>
        <p className="text-sm mt-2 text-neutral-500">{course.description}</p>
      </div>
      {!!onRemove && (
        <button
          onClick={onRemove}
          className={clsx(
            "absolute bottom-4 right-4 w-8 h-8",
            "flex items-center justify-center",
            "rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          )}
          aria-label="Remove course"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CourseCard;
