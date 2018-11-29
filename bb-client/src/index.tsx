import DefaultClient from "apollo-boost";
import "bootstrap/dist/css/bootstrap.min.css";
import dotenv from "dotenv";
import React from "react";
import { ApolloProvider } from "react-apollo";
import "react-dates/lib/css/_datepicker.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "rodal/lib/rodal.css";
import App from "./App";
import "./resources/css/index.css";
import * as serviceWorker from "./serviceWorker";

dotenv.config();

const uri = process.env.NODE_ENV === "development" ? "http://localhost:10262/graphql" : "future url";
console.log(`URI: ${uri}`);

export const client = new DefaultClient({
	headers: {
		oAuthSub: "adjijdfaa",
	},
	uri,
});

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
