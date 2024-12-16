import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useParams } from "wouter";

import { RouteParams } from "./ViewStudyPlan";

import { addCoursesToStudyPlan, Course, deleteCoursesFromStudyPlan, getAllCourses, getAllProgrammes, getCoursesFromStudyPlan, getStudyPlan, Programme, updateStudyPlan } from "~/api";
import CourseCard from "~/components/CourseCard";

function EditStudyPlan() {
    const { id } = useParams<RouteParams>();
    const navigate = useNavigate();
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [selectedProgramme, setSelectedProgramme] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [studyPlanName, setStudyPlanName] = useState<string>("");
    const [newCourses, setNewCourses] = useState<Course[]>([]);

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

    useEffect(() => {

        async function loadStudyPlanInfo() {
            const res = await getStudyPlan(id);
            setStudyPlanName(res ? res.name : "");
            const fetchedCourses = await getCoursesFromStudyPlan(id);
            setSelectedCourses(fetchedCourses.data);
            setNewCourses(fetchedCourses.data);
        }

        loadStudyPlanInfo();

    }, [id]);

    const handleProgramTreeClick = () => {
        window.location.href = "/plantree";
    };

    const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const courseId = event.target.value;

        if(courseId === "All courses") {
            setNewCourses(filteredCourses);
        }

        const selectedCourse = courses.find(course => course.id === courseId);
        if (selectedCourse && !newCourses.some(course => course.id === courseId)) {
            setNewCourses([...newCourses, selectedCourse]);
        }
    };

    const handleRemoveCourse = (courseId: string) => {
        setNewCourses(prevCourses => 
            prevCourses.filter(course => course.id !== courseId)
        );
    };

    const handleUpdateStudyPlan = () => {
        async function updatePlan() {

            try {

                const updatedStudyPlan = await updateStudyPlan(id, {name: studyPlanName});
                
                // Delete previous courses and add the new ones
                if(selectedCourses.length !== 0) {
                    const deleteCourses = selectedCourses.map(course => course.id);
                    const bodyRequst = {courses_ids: deleteCourses};
                    deleteCoursesFromStudyPlan(updatedStudyPlan, bodyRequst);
                }
    
                const addCourses = newCourses.map((course) => {
                    return {
                        id: course.id,
                        semester: 2
                    }
                });

                addCoursesToStudyPlan(updatedStudyPlan.id, {courses: addCourses});
    
            } catch (_) {
                
            } finally {
                navigate("/dashboard");
            }
        }

        updatePlan();
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudyPlanName(e.target.value);
    }

    const handleRemoveAllCourses = () => {
        setNewCourses([]);
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
            {newCourses.length > 0 ? (
                newCourses.map((course) => (
                    <CourseCard 
                        key={course.id}
                        name={course.name}
                        credits={course.credits}
                        code={course.code}
                        educational_level={course.educational_level}
                        description={course.description}
                        semester={course.semester}
                        onRemove={() => handleRemoveCourse(course.id)}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center py-4">
                    No courses selected. Please select courses from the dropdown above.
                </p>
            )}
        </div>
    );

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
                                    Update your study plan
                                </h1>
                                <div>
                                    <label htmlFor="study-plan-name" className="p-1 text-3xl text-black font-bold justify-center m-2">
                                        Name
                                    </label>
                                    <input
                                        id="study-plan-name"
                                        type="text"
                                        value={studyPlanName}
                                        onChange={handleChangeName}
                                        className="text-xl p-2 rounded-lg"/>
                                </div>
                                <div className="flex flex-col">
                                    <button 
                                        className="block text-xl w-auto m-2 h-10 p-2 px-8 rounded-lg text-white text-center text-bold bg-purple-600"
                                        onClick={handleUpdateStudyPlan}
                                    >
                                        Update Plan
                                    </button>
                                </div>
                            </div>

                            {renderProgrammeSelect()}
                            {renderCourseSelect()}

                            <hr className="border-black my-4" />
                            
                            <div id="current-plan" className="flex flex-row items-center justify-between px-4 py-2">
                                <h1 className="text-2xl text-black">Selected Courses</h1>
                                <button 
                                    className={`block text-xl w-auto m-2 h-10 p-2 px-8 rounded-lg text-white text-center text-bold ${selectedCourses.length !== 0 ? "bg-purple-600" : "bg-gray-400"}`}
                                    onClick={handleRemoveAllCourses}
                                    disabled={selectedCourses.length === 0}
                                >
                                    Remove all courses
                                </button>
                                <button 
                                    onClick={handleProgramTreeClick} 
                                    className="block text-xl w-1/3 m-4 h-10 p-2 rounded-lg text-white text-center text-bold bg-purple-600"
                                    disabled={!selectedProgramme}
                                >
                                    See Programme Tree
                                </button>
                            </div>

                            {renderSelectedCourses()}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default EditStudyPlan