import React from "react";

import Dashboard from "~/pages/Dashboard";
import Home from "~/pages/Home";
import StudyPlanView from "~/pages/StudyPlanView";
import { RouterItem } from "~/types/router";

const routes: RouterItem[] = [
  {
    title: "Home",
    path: "/",
    component: <Home />,
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
];

export default routes;