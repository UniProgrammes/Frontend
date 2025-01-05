import React, { useEffect, useRef, useState } from "react";

import { Spin } from "antd";
import { useParams } from "wouter";

import {
  Course,
  getCourseById,
  getCoursesFromStudyPlan,
  getStudyPlan,
  StudyPlan,
  validatePrerequisites,
  ValidRequisitesResponse
} from "~/api";
import StudyPlanView from "~/components/StudyPlanView";

export interface RouteParams {
  id: string;
}

function ViewStudyPlan() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { id } = useParams<RouteParams>();
  const refId = useRef<string>(id);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>();
  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<ValidRequisitesResponse>({
    is_valid: true,
    not_satisfied_prerequisites: []
  });
  const [newValid, setNewValid] = useState<{
    is_valid: boolean;
    not_satisfied_prerequisites: { course: Course; prerequisite: Course }[];
  }>({
    is_valid: true,
    not_satisfied_prerequisites: []
  });

  useEffect(() => {
    async function getCourses() {
      setLoading(true);
      try {
        const result = await getCoursesFromStudyPlan(refId.current);
        setCourses(result.data);

        const res = await getStudyPlan(refId.current);
        setStudyPlan(res);

        const val = await validatePrerequisites(res);
        setValid(val);
      } catch (_) {
        refId.current = "";
      }
      setLoading(false);
    }

    getCourses();
  }, [id]);

  useEffect(() => {
    async function fetchCourseNames() {
      const promises = valid.not_satisfied_prerequisites.map(async (pair) => {
        // Fetch the Course object for both the course and its prerequisite
        const course = await getCourseById(pair.course);
        const prerequisite = await getCourseById(pair.prerequisite);

        return { course, prerequisite };
      });

      return await Promise.all(promises);
    }

    const setNewValidCourses = async () => {
      setNewValid({ ...valid, not_satisfied_prerequisites: await fetchCourseNames() });
    };

    if (!valid.is_valid) {
      setNewValidCourses();
    }
  }, [valid]);


  return (
    <div>
      {refId.current.length !== 0 && studyPlan && (
          <StudyPlanView id={id} name={studyPlan.name} courses={courses} validation={newValid} />
        )}
      {!studyPlan && !loading && <p className="text-2xl text-red-600 text-center m-36">The study plan doesn't exist</p>}
      {loading && (
        <div className="flex justify-center">
          <Spin />
        </div>
      )}
    </div>
  );
}

export default ViewStudyPlan;
