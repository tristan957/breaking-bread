// tslint:disable: no-unsafe-any
import React from "react";
import "./resources/css/NotFound.css";
import { default as anim } from "./resources/images/loading-bread-no-spin.svg";

export default class NotFound extends React.Component {
	public render(): JSX.Element {
		return (
			<div id="not-found-container">
				<img id="not-found-anim" src={anim} />
				<div id="not-found-text">
					<h1>Uh oh!</h1>
					<h2>The page you are looking for does not exist.</h2>
					<span id="not-found-description">Click <a href="https://www.bbread.org/">here</a> to be redirected back to the homepage.<br />
						It's the <i>yeast</i> we can do!</span>
				</div>
			</div>
		);
	}
}
