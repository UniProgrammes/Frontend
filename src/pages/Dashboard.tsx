import React, { useEffect, useState } from "react";

import { getAllStudyPlans, StudyPlan, deleteStudyPlan } from "~/api";
import StudyPlanCard from "~/components/StudyPlanCard";

function Dashboard() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("");

  useEffect(() => {
    async function getStudyPlans() {
      const data = await getAllStudyPlans();
      setStudyPlans(data);
    }

    getStudyPlans();
  }, []);

  const handleSort = (order: string) => {
    const sortedPlans = [...studyPlans];
    if (order === "name") {
      sortedPlans.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === "date") {
      sortedPlans.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    setStudyPlans(sortedPlans);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudyPlan(id);
      setStudyPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete study plan:", error);
      alert("Could not delete the study plan. Please try again.");
    }
  };

  return (
    <div className="flex flex-row h-90vh overflow-hidden">
      <div id="main-content" className="w-full flex flex-col">
        <main id="planning-content" className="bg-neutral-300 rounded-3xl h-full p-4 m-8 flex flex-col">
          <div id="navigation-buttons" className="flex flex-row items-center justify-between px-8 pb-4">
            <h1 className="text-2xl font-bold text-neutral-700">Saved Study Plans</h1>
            <div className="bg-neutral-400 rounded-full p-2">
              <select
                className="bg-transparent outline-none cursor-pointer text-gray-800"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  handleSort(e.target.value);
                }}
              >
                <option value="" disabled hidden>
                  Sort Study Plans
                </option>
                <option value="name">Name</option>
                <option value="date">Last Updated</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {studyPlans.length > 0 ? (
              <div id="study-plan" className="grid grid-cols-2 gap-4">
                {studyPlans.map((studyPlan) => (
                  <StudyPlanCard
                    key={studyPlan.id}
                    id={studyPlan.id}
                    name={studyPlan.name}
                    completed={studyPlan.status !== "draft"}
                    numCourses={studyPlan.courses.length}
                    lastUpdate={studyPlan.updated_at.slice(0, 10)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="text-2xl text-gray-600 text-center m-36">
                No saved study plans!
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;