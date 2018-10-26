import * as React from "react";
import Background from "../components/Background";
import Footer from "../components/Footer";
import FormExample from "../components/FormExample";
import Header from "../components/Header";
import "./resources/css/HomePage.css";

export default class HomePage extends React.Component {
	public render(): JSX.Element {
		return (
			<div id="container">
				<div id="header">
					<Header />
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
