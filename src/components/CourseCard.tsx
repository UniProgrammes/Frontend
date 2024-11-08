import React from "react";

interface CourseCardProps {
  name: string;
  credits: string;
  code: string;
  educational_level: string;
  description: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  name, 
  credits, 
  code,
  educational_level,
  description 
}) => {
  return (
    <div className="bg-white shadow-md rounded-3xl p-4 w-full">
        <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
            <h3 className="text-2xl font-bold text-black m-2 mb-4 text-left">{name}</h3>
            <button className="block text-xl w-1/3 m-4 h-10 text-left p-2 rounded-lg text-white text-center text-bold bg-purple-600">
                Programme
            </button>
        </div>
        <p className="m-2 pl-4">{credits} ECTS credits</p>
        <p className="m-2 pl-4">{educational_level}</p>
        <p className="m-2 pl-4">{description}</p>
        <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
            <p className="m-2 pl-4">{code}</p>       
            <button className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-lg font-bold">
                🗑️
            </button> 
        </div>
    </div>
  );
};

export default CourseCard;
