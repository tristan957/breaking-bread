import { createBrowserHistory, History } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Router, Switch } from "react-router-dom";
import routes from "./routes";

const hist: History = createBrowserHistory();

ReactDOM.render(
	<Router history={hist}>
		<Switch>
			{/* tslint:disable-next-line: no-any */}
			{routes.map((prop: any, key: any) => {
				return <Route path={prop.path} key={key} component={prop.component} />;
			})}
		</Switch>
	</Router>,
	document.getElementById("app")
);
