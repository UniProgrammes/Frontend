import React from "react";

import { Switch, Route } from "wouter";

import routes from "~/router/routes";
import useMainStore from "~/stores/mainStore";

function Router() {
  const { isLoggedIn } = useMainStore();

  return (
    <Switch>
      {routes.filter((route) => !route.isPrivate || isLoggedIn).map((route) => (
        <Route key={route.path} path={route.path}>
          {route.component}
        </Route>
      ))}
    </Switch>
  );
}

export default Router;
