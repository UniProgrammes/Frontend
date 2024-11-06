import React from "react";
import CreatePlan from "~/pages/CreatePlan";

import Home from "~/pages/Home";
import PlanTree from "~/pages/PlanTree";
import TestBackendConnection from "~/pages/TestBackendConnection";
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
];

export default routes;