import * as React from "react";
import { Auth0Authentication } from "../auth/Auth0Authentication";
import { WebAuthentication } from "../auth/WebAuthentication";
import Background from "../components/Background";
import Footer from "../components/Footer";
import FormExample from "../components/FormExample";
import Header from "../components/Header";
import "./resources/css/HomePage.css";

const auth = new WebAuthentication();

type AppProps = {
	auth: Auth0Authentication;
};

export default class HomePage extends React.Component<AppProps> {
	public render(): JSX.Element {
		return (
			<div id="container">
				<div id="header">
					<Header auth={auth} {...this.props} />
				</div>

				<div id="content">
					<Background />
					<FormExample />
				</div>

				<div id="footer">
					<Footer />
				</div>
			</div>
		);
	}
}
