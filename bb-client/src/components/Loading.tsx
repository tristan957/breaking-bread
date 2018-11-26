import React from "react";
import "./resources/css/Loading.css";
import { default as anim } from "./resources/images/loading-bread.svg";

export default class Loading extends React.Component {
	public render(): JSX.Element {
		return (
			<div id="loading-container">
				<p id="loading-text">NOW LOADING</p>
				<img id="loading-image" src={anim} />
			</div>
		);
	}
}
