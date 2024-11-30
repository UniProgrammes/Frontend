import React, { useEffect, useRef, useState } from "react";

import { useParams } from "wouter";

import { Course, getCoursesFromStudyPlan, getStudyPlan, StudyPlan, validatePrerequisites, ValidRequisitesResponse } from "~/api";
import StudyPlanView from "~/components/StudyPlanView";

export interface RouteParams {
    id: string
}

function ViewStudyPlan() {

    const [courses, setCourses] = useState<Course[]>([]);
    const { id } = useParams<RouteParams>();
    const refId = useRef<string>(id);
    const [studyPlan, setStudyPlan] = useState<StudyPlan>();
    const [valid, setValid] = useState<ValidRequisitesResponse>({
                                                                    is_valid: false,
                                                                    not_satisfied_prerequisites: []
                                                                });
    useEffect(() => {
        async function getCourses() {
            try {
                const result = await getCoursesFromStudyPlan(refId.current);
                setCourses(result.data);

                const res = await getStudyPlan(refId.current);
                setStudyPlan(res);

                const val = await validatePrerequisites(res);
                setValid(val);
            } catch(_) {
                refId.current = "";
            }
        }
        
        getCourses();
    }, [id]);

    return(
        refId.current.length !== 0 && studyPlan
        ? <StudyPlanView id={id} name={studyPlan.name} courses={courses} validation={valid} />
        : <p className="text-2xl text-red-600 text-center m-36">
            The study plan doesn't exist
          </p>
    )
}

export default ViewStudyPlan