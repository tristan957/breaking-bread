import * as React from "react";

export interface IAuthCallbackPageProps { }

export default class AuthCallback extends React.Component<IAuthCallbackPageProps> {
	public style: React.CSSProperties = {
		position: "absolute",
		display: "flex",
		justifyContent: "center",
		height: "100vh",
		width: "100vw",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "white",
	};

	public render(): JSX.Element {
		return (
			<div style={this.style}>
			</div>
		);
	}
}
