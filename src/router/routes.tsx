import React from "react";

import CreatePlan from "~/pages/CreatePlan";
import Dashboard from "~/pages/Dashboard";
import Home from "~/pages/Home";
import PlanTree from "~/pages/PlanTree";
import Profile from "~/pages/Profile";
import StudyPlanView from "~/pages/StudyPlanView";
import ViewProgramme from "~/pages/ViewProgramme";
import { RouterItem } from "~/types/router";

const routes: RouterItem[] = [
  {
    title: "Home",
    path: "/",
    component: <Home />,
  },
  {
    title: "Create Plan",
    path: "/createplan",
    component: <CreatePlan />,
  },
  {
    title: "Plan Tree",
    path: "/plantree",
    component: <PlanTree />,
  },
  {
    title: "Dasboard",
    path: "/dashboard",
    component: <Dashboard />,
  },
  {
    title: "Study Plan",
    path: "/study-plan",
    component: <StudyPlanView />,
  },
  {
    title: "Profile",
    path: "/profile",
    component: <Profile />,
    isPrivate: true,
  },
  {
    title: "View Programme & Courses",
    path: "/view-programme",
    component: <ViewProgramme />,
  },
];

export default routes;