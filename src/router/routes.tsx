import React from "react";

import Home from "~/pages/Home";
import { RouterItem } from "~/types/router";

const routes: RouterItem[] = [
  {
    title: "Home",
    path: "/",
    component: <Home />,
  },
];

export default routes;