// tslint:disable
import * as React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./resources/css/Footer.css";

export default class Footer extends React.Component {
	public render(): JSX.Element {
		return (
			<footer id={"footer"}>
				<Nav justified>
					<NavItem>
						<NavLink href="#">About Us</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#">Yeet</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#">who 8 my sphaget</NavLink>
					</NavItem>
				</Nav>
			</footer>
		);
	}
}
