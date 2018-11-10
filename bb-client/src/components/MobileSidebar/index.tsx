// tslint:disable: no-unsafe-any
import React from "react";
import Sidebar from "react-sidebar";
import { Button } from "reactstrap";

interface IAppState {
	sidebarOpen: boolean;
}

export default class NavigationBar extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);
		this.setSidebarOpen = this.setSidebarOpen.bind(this);
		this.state = {
			sidebarOpen: true,
		};
	}

	public setSidebarOpen(): void {
		this.setState({
			sidebarOpen: !this.state.sidebarOpen,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="mobileSidebar">
				<Sidebar
					sidebar={<b>Sidebar content</b>}
					open={this.state.sidebarOpen}
					onSetOpen={this.setSidebarOpen}
					styles={{ sidebar: { background: "white" } }}>
					<Button onClick={this.setSidebarOpen.bind(this)}> Open Sidebar </Button>
				</Sidebar>
			</div>
		);
	}
}
