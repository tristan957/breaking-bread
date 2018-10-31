import React from "react";
import { Route, RouteComponentProps } from "react-router";
import { Router } from "react-router-dom";
import { WebAuthentication } from "./auth/WebAuthentication";
import Content from "./components/Content";
import history from "./history";
import Callback from "./views/Callback";
import HomePage from "./views/HomePage";
import MealProfile from "./views/MealProfilePage";

const auth = new WebAuthentication();

const handleAuthentication = (props: RouteComponentProps) => {
	if (/access_token|id_token|error/.test(location.hash)) {
		auth.handleAuthentication();
	}
};

export default class App extends React.Component {
	public render(): JSX.Element {
		return (
			<Router history={history}>
				<main>
					<Route
						path="/"
						render={props => <HomePage auth={auth} {...props} />}
					/>
					<Route
						path="/home"
						render={props => <Content {...props} />}
					/>
					<Route
						path="/mealProfile"
						render={props => <MealProfile {...props} />}
					/>
					<Route
						path="/callback"
						render={props => {
							handleAuthentication(props);
							return <Callback {...props} />;
						}}
					/>
				</main>
			</Router>
		);
	}
}
