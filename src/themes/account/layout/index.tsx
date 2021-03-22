import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import PageNotFound from "../../../modules/no-route";
import { accountsRoutes } from "../routers/routes";

export default function AccountLayout() {
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <Switch>
        {accountsRoutes
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
    </Suspense>
  );
}
