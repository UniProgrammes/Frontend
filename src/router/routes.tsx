import React from "react";

import CreatePlan from "~/pages/CreatePlan";
import Dashboard from "~/pages/Dashboard";
import EditStudyPlan from "~/pages/EditStudyPlan";
import Help from "~/pages/Help";
import Home from "~/pages/Home";
import PlanTree from "~/pages/PlanTree";
import Profile from "~/pages/Profile";
import ViewProgramme from "~/pages/ViewProgramme";
import ViewStudyPlan from "~/pages/ViewStudyPlan";
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
    isPrivate: true,
  },
  {
    title: "View Study Plan",
    path: "/study-plan/:id",
    component: <ViewStudyPlan />,
    isPrivate: true,
  },
  {
    title: "Edit Study Plan",
    path: "/edit-study-plan/:id",
    component: <EditStudyPlan />,
    isPrivate: true,
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
  {
    title: "Help",
    path: "/help",
    component: <Help />,
  },
];

export default routes;