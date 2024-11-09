import React from "react";
import CourseCard from "~/components/CourseCard";


// Acces this page, change the url to .../createplan

function CreatePlan() {
    const handleProgramTreeClick = () => {
        window.location.href = '/plantree';
    };

    return(
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <header id="top-buttons" className="m-8 flex items-center justify-between">
                    <button id="user-identifier" className="bg-neutral-300 w-auto h-auto rounded-2xl text-2xl p-4">
                        User
                    </button>
                    <button id="notifications-button" className="bg-neutral-300 w-auto h-auto rounded-2xl text-2xl p-4">
                        Notifications
                    </button>
                </header>
                <main id="create-plan" className="bg-neutral-300 rounded-3xl p-4 m-8">
                    <div id="choose-program" className="flex items-center justify-between bg-neutral-300 rounded-xl h-16 p-2 m-8">
                            <h1 className="p-8 pl-4 text-4xl text-black font-bold justify-center">
                                Create your study plan
                            </h1> 
                            <button className="block text-xl w-auto m-4 h-10 text-left p-2 px-8 rounded-lg text-white text-center text-bold bg-purple-600">Save Plan</button>
                    </div>

                    <div id="choose-program" className="flex items-center justify-between bg-[#C3AAEA] rounded-xl h-16 p-2 m-8">
                        <h1 className="text-2xl text-black">
                            Choose your program
                        </h1> 
                        <input
                        type="text"
                        placeholder="Select a program"
                        className="border border-gray-400 rounded-md p-2 w-2/3"
                        />
                    </div>
                    <div id="add-course" className="flex items-center justify-between bg-[#C3AAEA] rounded-xl h-16 p-2 m-8">
                        <h1 className="text-2xl text-black">
                            Add courses
                        </h1> 
                        <select className="border border-gray-400 rounded-md p-2 w-2/3">
                            <option value="program1">Course 1</option>
                            <option value="program2">Course 2</option>
                            <option value="program3">Course 3</option>
                            <option value="program4">Course 4</option>
                        </select>
                    </div>
                    <hr className="border-black my-4" />
                    <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
                        <h1 className="text-2xl text-black">Selected Courses</h1> 
                        <button onClick={handleProgramTreeClick} className="block text-xl w-1/3 m-4 h-10 text-left p-2 rounded-lg text-white text-center text-bold bg-purple-600">See Programme Tree</button>
                    </div>
                    <div id="selected-courses" className="w-full space-y-4">
                        <CourseCard name="Course 1" ects="10" year="2024/2025" code="APJFG1011"/>
                        <CourseCard name="Course 2" ects="9" year="2024/2025" code="ATJT3528"/>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CreatePlan