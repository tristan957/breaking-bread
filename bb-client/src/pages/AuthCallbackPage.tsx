import * as React from "react";
import loading from "./resources/images/loading.svg";

export interface IAuthCallbackPageProps { }

const AuthCallback: React.SFC<IAuthCallbackPageProps> = props => {
	const style: React.CSSProperties = {
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

	return (
		<div style={style}>
			<img src={loading} alt="loading" />
		</div>
	);
};
export default AuthCallback;