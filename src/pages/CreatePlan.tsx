import React, { useState, useEffect } from "react";

import { notification } from "antd"
import { useNavigate } from "react-router-dom";

import { getAllProgrammes, getAllCourses, saveStudyPlan, addCoursesToStudyPlan, Course, getAllStudyPlans } from "~/api";
import CourseCard from "~/components/CourseCard";
import { checkName } from "~/lib/utils";

interface Programme {
  id: string;
  name: string;
  degree_type: string;
  credits: string;
  created_at: string;
  updated_at: string;
  courses: string[];
}

function CreatePlan() {
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [selectedProgramme, setSelectedProgramme] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [planName, setPlanName] = useState("");
    const navigate = useNavigate();
    const [PlanNameErrorMessage, setPlanNameErrorMessage] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [programmesData, coursesData] = await Promise.all([
                    getAllProgrammes(),
                    getAllCourses()
                ]);

                if (!programmesData || programmesData.length === 0) {
                    setError("No programmes available");
                    setProgrammes([]);
                } else {
                    setProgrammes(programmesData);
                }

                if (!coursesData || coursesData.length === 0) {
                    setError(prev => prev ? `${prev}, No courses available` : "No courses available");
                    setCourses([]);
                } else {
                    setCourses(coursesData);
                }
            } catch (error) {
                setError("Failed to fetch data. Please try again later.");
                // eslint-disable-next-line no-console
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedProgramme && courses.length > 0) {
            const programme = programmes.find(p => p.id === selectedProgramme);
            if (programme) {
                const programCourses = courses.filter(course => 
                    programme.courses.includes(course.id.toString())
                );
                setFilteredCourses(programCourses);
            }
        } else {
            setFilteredCourses([]);
        }
    }, [selectedProgramme, courses, programmes]);

    const handleProgramTreeClick = () => {
        if (selectedProgramme) {
            window.location.href = `/plantree?programmeId=${selectedProgramme}`;
        }
        else {
            alert("Please select a programme first.");
        }
    };

    const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const courseId = event.target.value;
        if(courseId === "All courses") {
            setSelectedCourses(filteredCourses);
        }
        const selectedCourse = courses.find(course => course.id === courseId);
        if (selectedCourse && !selectedCourses.some(course => course.id === courseId)) {
            setSelectedCourses([...selectedCourses, selectedCourse]);
        }
    };

    const handleRemoveCourse = (courseCode: string) => {
        setSelectedCourses(prevCourses => 
            prevCourses.filter(course => course.code !== courseCode)
        );
    };

    const handleRemoveAllCourses = () => {
        setSelectedCourses([]);
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        checkName(newName).then(() => {
            setPlanName(newName);
            setPlanNameErrorMessage("");
        })
        .catch((error: Error) => {
            setPlanNameErrorMessage(error.message);
            setPlanName(newName);
        });
    };

    const handleCreateStudyPlan = (planName: string) => {

        async function savePlan() {
            const body = { name: planName };
            await saveStudyPlan(body).then((studyPlan) => {
                const bodyRequest = selectedCourses.map((c) => {
                    return {
                        id: c.id,
                        semester: 2
                    }
                });
                addCoursesToStudyPlan(studyPlan.id, { courses: bodyRequest });
            }).catch((error) => {
                throw error;
            });
        }

        savePlan()
        .then(() => {
            
            notification.success({
                message: "Study Plan saved",
                description: "You have successfully saved your study plan"
            });
            
            navigate("/dashboard")
        })
        .catch(() => {
            notification.error({
                message: "Study Plan",
                description: "Error on saving study plan. Try again later"
            });
        });
    }

    const renderProgrammeSelect = () => (
        <div id="choose-program" className="flex items-center justify-between bg-[#C3AAEA] rounded-xl h-16 p-2 m-8">
            <h1 className="text-2xl text-black">
                Choose your program
            </h1> 
            {programmes.length > 0 ? (
                <select
                    value={selectedProgramme}
                    onChange={(e) => setSelectedProgramme(e.target.value)}
                    className="border border-gray-400 rounded-md p-2 w-2/3"
                >
                    <option value="">Select a program</option>
                    {programmes.map((programme) => (
                        <option key={programme.id} value={programme.id}>
                            {`${programme.name} (${programme.degree_type}) - ${programme.credits} ECTS`}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="text-red-600">No programmes available</p>
            )}
        </div>
    );

    const renderCourseSelect = () => (
        <div id="add-course" className="flex items-center justify-between bg-[#C3AAEA] rounded-xl h-16 p-2 m-8">
            <h1 className="text-2xl text-black">
                Add courses
            </h1> 
            {courses.length > 0 ? (
                <select 
                    onChange={handleCourseSelect}
                    className="border border-gray-400 rounded-md p-2 w-2/3"
                    disabled={!selectedProgramme}
                >
                    <option value="">
                        {!selectedProgramme 
                            ? "Please select a programme first" 
                            : "Select a course"
                        }
                    </option>
                    <option value="All courses">All courses</option>
                    {filteredCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="text-red-600">No courses available</p>
            )}
        </div>
    );

    const renderSelectedCourses = () => (
        <div id="selected-courses" className="w-full space-y-4">
            {selectedCourses.length > 0 ? (
                selectedCourses.map((course) => (
                    <CourseCard 
                        key={course.id}
                        name={course.name}
                        credits={course.credits}
                        code={course.code}
                        educational_level={course.educational_level}
                        description={course.description}
                        semester={course.semester}
                        onRemove={() => handleRemoveCourse(course.code)}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center py-4">
                    No courses selected. Please select courses from the dropdown above.
                </p>
            )}
        </div>
    );

    const handleSaveClick = () => {
        const totalCredits = selectedCourses.reduce((acc, current) => parseFloat(current.credits) + acc, 0);
        const programme = programmes.filter((program) => program.id === selectedProgramme)[0];
        if(totalCredits > parseFloat(programme.credits)) {
            alert("You cannot course more credits than the assigned by the program\n"
                + `Total: ${totalCredits} ECTS || Limit: ${programme.credits} ECTS`
            );

            return;
        }
        setModalOpen(true);
      };
    
    const handleModalSave = async () => {
        if (!planName.trim()) {
            alert("Please enter a valid name for the study plan.");
            return;
        }

        const studyPlan = await getAllStudyPlans();
        if(studyPlan.filter(plan => plan.name === planName).length != 0) {
            alert("You cannot have two study plans with the same name");
            return;
        }

        setModalOpen(false); 
        handleCreateStudyPlan(planName); 
        setPlanName(""); 
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setPlanName(""); 
    };

    const inputStyle = PlanNameErrorMessage ? "border-red-500 border-2 p-2" : "p-2";

    return (
        <div className="flex flex-row max-h-full max-w-full">
            <div id="main-content" className="w-full flex flex-col">
                <main id="create-plan" className="bg-neutral-300 rounded-3xl p-4 m-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-xl">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-red-600 text-xl">{error}</p>
                        </div>
                    ) : (
                        <>
                            <div id="header" className="flex items-center justify-between bg-neutral-300 rounded-xl h-16 p-2 m-8">
                                <h1 className="p-8 pl-4 text-4xl text-black font-bold justify-center">
                                    Create your study plan
                                </h1> 
                                <button 
                                        className="block text-xl w-auto m-4 h-10 p-2 px-8 rounded-lg text-white text-center text-bold bg-purple-600 disabled:opacity-50"
                                    disabled={selectedCourses.length === 0}
                                    onClick={handleSaveClick}
                                >
                                    Save Plan
                                </button>
                            </div>

                            {renderProgrammeSelect()}
                            {renderCourseSelect()}

                            <hr className="border-black my-4" />
                            
                            <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
                                <h1 className="text-2xl text-black">Selected Courses</h1> 
                                <button 
                                    onClick={handleRemoveAllCourses} 
                                    className={`block text-xl w-1/3 m-4 h-10 p-2 rounded-lg text-white text-center text-bold ${selectedCourses.length !== 0 ? "bg-purple-600" : "bg-gray-400"} `}
                                    disabled={selectedCourses.length === 0}
                                >
                                    Remove all courses
                                </button>
                                <button 
                                    onClick={handleProgramTreeClick} 
                                    className="block text-xl w-1/3 m-4 h-10 p-2 rounded-lg text-white text-center text-bold bg-purple-600 "
                                    disabled={selectedCourses.length === 0}
                                >
                                    See Programme Tree
                                </button>
                            </div>

                            {renderSelectedCourses()}
                        </>
                    )}
                </main>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                    <h2 className="text-xl font-bold text-center mb-4">Name Your Study Plan</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={planName}
                            onChange={handleNameChange}
                            placeholder="Enter study plan name"
                            className={`w-full border rounded-lg ${inputStyle} focus:${inputStyle}`}
                        />
                        {PlanNameErrorMessage && (
                            <p className="mt-2 pl-1 text-pink-600 text-sm">
                                {PlanNameErrorMessage}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                        onClick={handleModalClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        onClick={handleModalSave}
                        disabled={PlanNameErrorMessage !== ""}
                    >
                        Save
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}

export default CreatePlan;