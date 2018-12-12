import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "react-dates/lib/css/_datepicker.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./resources/css/index.css";
import * as serviceWorker from "./serviceWorker";

const uri = process.env.NODE_ENV === "development" ? "http://localhost:10262/graphql" : "https://www.partin.io/bread/api/v1/graphql";

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
