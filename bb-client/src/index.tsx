import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { ErrorResponse, onError } from "apollo-link-error";
import { ServerError } from "apollo-link-http-common";
import "bootstrap/dist/css/bootstrap.min.css";
import dotenv from "dotenv";
import React from "react";
import { ApolloProvider } from "react-apollo";
import "react-dates/lib/css/_datepicker.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./resources/css/index.css";
import * as serviceWorker from "./serviceWorker";

dotenv.config();

const uri = process.env.NODE_ENV === "development" ? "http://localhost:10262/graphql" : "https://www.bbread.org/api/v1/graphql";
console.log(`URI: ${uri}`);

// let accessToken: string | null = localStorage.getItem("access_token");
// accessToken = accessToken === null ? "" : accessToken;

const client = new ApolloClient({
	link: ApolloLink.from([
		onError((error: ErrorResponse) => {
			console.log("I AM AN ERROR");
			if (error.graphQLErrors) {
				error.graphQLErrors.map(graphQLError => {
					console.log(
						`[GraphQL error]: Message: ${graphQLError.message}, Location: ${graphQLError.locations}, Path: ${graphQLError.path}`
					);
				});
			}

			if (error.networkError) {
				console.log(`[Network error]: ${error.networkError}`);
				const e = error.networkError as ServerError;
				if (e.statusCode === 404) {
					console.log("I am a 404 error");
					document.write("<h1>you suck</h1>");
				}
			}
		}),
		new BatchHttpLink({
			uri,
			headers: {
<<<<<<< HEAD
				oAuthSub: "adjijdfaa",
=======
				token_bearer: "google-oauth2|104114134196689419228",
>>>>>>> 98e265fddc1702bf32754e5cee4c72324b8aecee
			},
		}),
	]),
	cache: new InMemoryCache(),
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
