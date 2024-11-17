import React from "react";
import CreatePlan from "~/pages/CreatePlan";

import Dashboard from "~/pages/Dashboard";
import Home from "~/pages/Home";
import PlanTree from "~/pages/PlanTree";
import TestBackendConnection from "~/pages/TestBackendConnection";
import StudyPlanView from "~/pages/StudyPlanView";
import { RouterItem } from "~/types/router";
import Profile from "~/pages/Profile";

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
  },
];

export default routes;