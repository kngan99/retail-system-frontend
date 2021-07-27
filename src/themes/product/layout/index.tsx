import React from "react";
import { Switch, Route } from "react-router-dom";
import PageNotFound from "../../../modules/no-route";
import { productsRoutes } from "../routers/routes";

export default function ProductLayout() {
  return (
    <Switch>
      {productsRoutes
        .filter((item: any) => !item.isLayout)
        .map((item: any) => (
          <Route
            path={item.path}
            component={item.component}
            exact={item.exact}
            render={item.component}
          />
        ))}
      <Route component={PageNotFound} />
    </Switch>
  );
}
