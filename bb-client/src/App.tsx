import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, Router, Switch } from "react-router-dom";
import routes from "./routes";

export default class App extends React.Component {
	public render(): JSX.Element {
		return (
			<Router history={createBrowserHistory()}>
				<Switch>
					{
						// tslint:disable
						routes.map((prop: any, key: any) => {
							return <Route path={prop.path} key={key} component={prop.component} />;
						})
					}
				</Switch>
			</Router>
		);
	}
}
