import { useEffect, useState } from "react";

import { Select } from "antd";
import { useNavigate, useLocation  } from "react-router-dom";
import { useParams } from "wouter";

import { RouteParams } from "./ViewStudyPlan";

import {
  addCoursesToStudyPlan,
  Course,
  deleteCoursesFromStudyPlan,
  getAllCourses,
  getAllProgrammes,
  getCoursesFromStudyPlan,
  getStudyPlan,
  Programme,
  updateStudyPlanName
} from "~/api";
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
  const location = useLocation();
  const { courseSelection } = location.state || {};
  const { programme } = location.state || {};
  const { planId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [programmesData, coursesData] = await Promise.all([getAllProgrammes(), getAllCourses()]);

        if (!programmesData || programmesData.length === 0) {
          setError("No programmes available");
          setProgrammes([]);
        } else {
          setProgrammes(programmesData);
        }

        if (!coursesData || coursesData.length === 0) {
          setError((prev) => (prev ? `${prev}, No courses available` : "No courses available"));
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
      const programme = programmes.find((p) => p.id === selectedProgramme);
      if (programme) {
        const programCourses = courses.filter((course) => programme.courses.includes(course.id.toString()));
        setFilteredCourses(programCourses);
      }
    } else {
      setFilteredCourses([]);
    }
  }, [selectedProgramme, courses, programmes]);

  useEffect(() => {
    if (planId){
        async function loadStudyPlanInfo() {
            const res = await getStudyPlan(planId);
            setStudyPlanName(res ? res.name : "");
        }
        loadStudyPlanInfo();

        if (courseSelection) {
            const preselectedCourses = courses.filter((course) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                courseSelection.includes(course.id)
            );
            setSelectedCourses(preselectedCourses);
            setNewCourses(preselectedCourses);
        }
        if (programme) {
            setSelectedProgramme(programme);
        }
    }
    else{
        async function loadStudyPlanInfo() {
            const res = await getStudyPlan(id);
            setStudyPlanName(res ? res.name : "");
            const fetchedCourses = await getCoursesFromStudyPlan(id);
            setSelectedCourses(fetchedCourses.data);
            setNewCourses(fetchedCourses.data);
        }

        loadStudyPlanInfo();
    }
  }, [id, courseSelection, programme, courses, planId]);

  const handleProgramTreeClick = () => {
    if (selectedProgramme) {
        navigate(`/plantree?programmeId=${selectedProgramme}`, {
            state: {
                courseSelection: selectedCourses.map(course => course.id),
                planId: id,
            },
        });
    }
    else {
        alert("Please select a programme first.");
    }
  };

  const handleCourseSelect = (courseIds: string[]) => {
    const newSelectedCourses = courseIds.map(id =>
      courses.find(course => course.id === id)
    ).filter((course): course is Course => course !== undefined);
    setSelectedCourses(newSelectedCourses);
  };

  const handleRemoveCourse = (courseId: string) => {
    setNewCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
  };

  const handleUpdateStudyPlan = () => {
    async function updatePlan() {
      try {
        const updatedStudyPlan = await updateStudyPlanName(id, { name: studyPlanName });

        // Delete previous courses and add the new ones
        if (selectedCourses.length !== 0) {
          const deleteCourses = selectedCourses.map((course) => course.id);
          const bodyRequst = { courses_ids: deleteCourses };
          deleteCoursesFromStudyPlan(updatedStudyPlan, bodyRequst);
        }

        const addCourses = newCourses.map((course) => {
          return {
            id: course.id,
            semester: course.semester
          };
        });

        addCoursesToStudyPlan(updatedStudyPlan.id, { courses: addCourses });
      } catch (_) {
      } finally {
        navigate("/dashboard");
      }
    }

    updatePlan();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudyPlanName(e.target.value);
  };

  const handleSelectAllCourses = () => {
    const allCourseIds = filteredCourses.map(course => course.id);
    handleCourseSelect(allCourseIds);
  };

  const handleDeselectAllCourses = () => {
    handleCourseSelect([]);
  };

  return (
    <div className="flex flex-row min-h-screen max-w-full">
      <div id="main-content" className="w-full flex flex-col bg-neutral-300 rounded-xl py-4 px-8 m-8">
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
              <div id="header" className="flex items-center justify-between h-16 p-2">
                <h1 className="text-2xl font-bold">Update your study plan</h1>
                <div>
                  <label htmlFor="study-plan-name" className="p-1 text-xl text-black font-bold justify-center m-2">
                    Name
                  </label>
                  <input
                    id="study-plan-name"
                    type="text"
                    value={studyPlanName}
                    onChange={handleChangeName}
                    className="text-xl p-2 rounded-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    className="text-lg py-2 px-6 rounded-md text-white font-bold bg-purple-600 disabled:opacity-50"
                    disabled={selectedCourses.length === 0}
                    onClick={handleUpdateStudyPlan}
                  >
                    Update Plan
                  </button>
                </div>
              </div>

              <div className="flex flex-row shadow-lg rounded-lg bg-white my-6">
                <div id="choose-program" className="flex flex-col w-1/2 p-4">
                  <label className="text-lg text-black">Choose your program</label>
                  {programmes.length > 0 ? (
                    <Select
                      value={selectedProgramme || undefined}
                      onChange={(value) => setSelectedProgramme(value)}
                      className="w-full"
                      placeholder="Select a program"
                      options={programmes.map((programme) => ({
                        value: programme.id,
                        label: `${programme.name} (${programme.degree_type}) - ${programme.credits} ECTS`
                      }))}
                    />
                  ) : (
                    <p className="text-red-600">No programmes available</p>
                  )}
                </div>
                <div id="add-course" className="flex flex-col w-1/2 p-4">
                  <label className="text-lg text-black">Select courses</label>
                  {courses.length > 0 ? (
                    <Select
                      mode="multiple"
                      onChange={handleCourseSelect}
                      className="w-full"
                      disabled={!selectedProgramme}
                      placeholder={!selectedProgramme ? "Please select a programme first" : "Select courses"}
                      options={filteredCourses.map((course) => ({
                        value: course.id,
                        label: course.name
                      }))}
                      value={selectedCourses.map(course => course.id)}
                      maxTagCount={3}
                      maxTagPlaceholder={(omitted) => `+ ${omitted.length} more...`}
                      dropdownRender={(menu) => (
                        <div>
                          <div className="px-3 py-2 flex gap-2 border-b">
                            <button
                              className="text-sm text-purple-600 hover:text-purple-800"
                              onClick={handleSelectAllCourses}
                            >
                              Select All
                            </button>
                            <button
                              className="text-sm text-purple-600 hover:text-purple-800"
                              onClick={handleDeselectAllCourses}
                            >
                              Deselect All
                            </button>
                          </div>
                          {menu}
                        </div>
                      )}
                    />
                  ) : (
                    <p className="text-red-600">No courses available</p>
                  )}
                </div>
              </div>

              <div id="current-plan" className="flex flex-row items-center justify-between py-2">
                <h1 className="text-2xl text-black">Selected Courses</h1>
                <button
                  onClick={handleProgramTreeClick}
                  className="text-lg rounded-lg text-white font-bold bg-purple-600 px-4 py-2"
                >
                  See Programme Tree
                </button>
              </div>

              <div id="selected-courses" className="w-full grid grid-cols-3 gap-4">
                {selectedCourses.length > 0 ? (
                  selectedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onRemove={() => handleRemoveCourse(course.code)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 col-span-3">
                    No courses selected. Please select courses from the dropdown above.
                  </p>
                )}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default EditStudyPlan;
