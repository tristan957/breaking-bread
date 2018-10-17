import React from "react";
import { Grid, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

export default class Footer extends React.Component {
	public render(): JSX.Element {
		return (
			<footer id={"footer"}>
				<Grid>
					<Nav justified={true}>
						<LinkContainer to="/home">
							<NavItem className={"testing"} eventKey={1}>Home</NavItem>
						</LinkContainer>
						<NavItem eventKey={1} href={"#"}>
							Privacy policy
						</NavItem>
						<NavItem bsStyle={"link"} eventKey={2} href={"#"} title="Item">
							Terms & Conditions
						</NavItem>
						<NavItem bsStyle={"link"} eventKey={3} href={"#"}>
							<Link to={"/test-page"}>
								About Us
							</Link>
						</NavItem>
					</Nav>

					<div className="text-center small copyright">
						© Breaking Bread 2018
					</div>
				</Grid>
			</footer>
		);
	}
}
