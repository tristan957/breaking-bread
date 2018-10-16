import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import './Header.css';
class Header extends React.Component {
    render() {
        return (React.createElement(Navbar, { inverse: true, collapseOnSelect: true },
            React.createElement(Navbar.Header, null,
                React.createElement(Navbar.Brand, { href: "#" },
                    React.createElement("span", null,
                        React.createElement("img", { src: "https://logo.clearbit.com/panerabread.com", height: "20", className: "d-inline-block align-top" })),
                    "Breaking Bread"),
                React.createElement(Navbar.Toggle, null)),
            React.createElement(Navbar.Collapse, null,
                React.createElement(Nav, { pullRight: true },
                    React.createElement(NavItem, { eventKey: 1, href: "#" }, "Log In"),
                    React.createElement(NavItem, { eventKey: 2, href: "#" }, "Sign Up")))));
    }
}
export default Header;
//# sourceMappingURL=Header.js.map