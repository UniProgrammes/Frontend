import React from "react";

import { Switch, Route } from "wouter";

import routes from "~/router/routes";

function Router() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} path={route.path}>
          {route.component}
        </Route>
      ))}
    </Switch>
  );
}

export default Router;
