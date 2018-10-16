import * as React from 'react';
import { Grid, Nav, NavItem } from 'react-bootstrap';
function Footer() {
    return (React.createElement("footer", null,
        React.createElement(Grid, null,
            React.createElement(Nav, { justified: true },
                React.createElement(NavItem, { eventKey: 1 }, "Privacy policy"),
                React.createElement(NavItem, { eventKey: 2, title: "Item" }, "Terms & Conditions"),
                React.createElement(NavItem, { eventKey: 3 }, "Some other professional link")),
            React.createElement("div", { className: "text-center small copyright" }, "\u00A9 Breaking Bread 2018"))));
}
export default Footer;
//# sourceMappingURL=Footer.js.map