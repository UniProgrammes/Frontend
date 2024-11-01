import React from "react";

import Dashboard from "~/pages/Dashboard";
import Home from "~/pages/Home";
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
];

export default routes;