import React, { useState, useEffect } from "react";

import { notification, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { courseSelection } = location.state || {};
  const { programme } = location.state || {};

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
    if (courseSelection) {
      const preselectedCourses = courses.filter((course) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        courseSelection.includes(course.id)
      );
      setSelectedCourses(preselectedCourses);
    }
    if (programme) {
      setSelectedProgramme(programme);
    }
  }, [courseSelection, programme, courses]);

  const handleProgramTreeClick = () => {
    if (selectedProgramme) {
      navigate(`/plantree?programmeId=${selectedProgramme}`, {
        state: {
          courseSelection: selectedCourses.map((course) => course.id)
        }
      });
    } else {
      notification.warning({
        message: "Programme Required",
        description: "Please select a programme first."
      });
    }
  };

  const handleCourseSelect = (courseIds: string[]) => {
    const newSelectedCourses = courseIds.map(id =>
      courses.find(course => course.id === id)
    ).filter((course): course is Course => course !== undefined);
    setSelectedCourses(newSelectedCourses);
  };

  const handleRemoveCourse = (courseCode: string) => {
    setSelectedCourses((prevCourses) => prevCourses.filter((course) => course.code !== courseCode));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    checkName(newName)
      .then(() => {
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
      await saveStudyPlan(body)
        .then((studyPlan) => {
          const bodyRequest = selectedCourses.map((c) => {
            return {
              id: c.id,
              semester: c.semester
            };
          });
          addCoursesToStudyPlan(studyPlan.id, { courses: bodyRequest });
        })
        .catch((error) => {
          throw error;
        });
    }

    savePlan()
      .then(() => {
        notification.success({
          message: "Study Plan saved",
          description: "You have successfully saved your study plan"
        });

        navigate("/dashboard");
      })
      .catch(() => {
        notification.error({
          message: "Study Plan",
          description: "Error on saving study plan. Try again later"
        });
      });
  };

  const handleSaveClick = () => {
    const totalCredits = selectedCourses.reduce((acc, current) => parseFloat(current.credits) + acc, 0);
    const programme = programmes.filter((program) => program.id === selectedProgramme)[0];
    if (totalCredits > parseFloat(programme.credits)) {
      alert(
        "You cannot course more credits than the assigned by the program\n" +
          `Total: ${totalCredits} ECTS || Limit: ${programme.credits} ECTS`
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
    if (studyPlan.filter((plan) => plan.name === planName).length != 0) {
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

  const handleSelectAllCourses = () => {
    const allCourseIds = filteredCourses.map(course => course.id);
    handleCourseSelect(allCourseIds);
  };

  const handleDeselectAllCourses = () => {
    handleCourseSelect([]);
  };

  const inputStyle = PlanNameErrorMessage ? "border-red-500 border-2 p-2" : "p-2";

  return (
    <div className="flex flex-row max-w-full">
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
              <h1 className="text-2xl font-bold">Create your study plan</h1>
              <button
                className="text-lg py-2 px-6 rounded-md text-white font-bold bg-purple-600 disabled:opacity-50"
                disabled={selectedCourses.length === 0}
                onClick={handleSaveClick}
              >
                Save Plan
              </button>
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
              {PlanNameErrorMessage && <p className="mt-2 pl-1 text-pink-600 text-sm">{PlanNameErrorMessage}</p>}
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
