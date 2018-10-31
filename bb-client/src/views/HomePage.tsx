import React from "react";
import { Auth0Authentication } from "../auth/Auth0Authentication";
import Content from "../components/Content";
import Footer from "../components/Footer";
import FormExample from "../components/FormExample";
import Header from "../components/Header";
import "./resources/css/HomePage.css";

type AppProps = {
	auth: Auth0Authentication;
};

export default class HomePage extends React.Component<AppProps> {
	public render(): JSX.Element {
		return (
			<div id="container">
				<div id="header">
					<Header auth={this.props.auth} {...this.props} />
				</div>

				<div id="content">
					<Content />
					<FormExample />
				</div>

				<div id="footer">
					<Footer />
				</div>
			</div>
		);
	}
}
