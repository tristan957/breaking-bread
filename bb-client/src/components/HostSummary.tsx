// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import Topic from "../entities/Topic";
import { default as TopicComponent } from "./Item";
import "./resources/css/HostSummary.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

interface IHostSummaryProps {
	id: number;
	name: string;
	about?: string;
	imagePath?: string;
	topics: Partial<Topic>[];
}

export default class HostSummary extends React.Component<IHostSummaryProps> {
	private renderTopics(): JSX.Element | undefined {
		if (this.props.topics.length === 0) {
			return undefined;
		}

		return (
			<div>
				<div id="host-summary-interests">Interests</div>
				<ul className="no-style-list">
					{this.props.topics.map((topic, i) => {
						return (
							<li className="topic" key={i}>
								<TopicComponent id={topic.id as number} leadingChar="#" name={topic.name as string} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	public render(): JSX.Element {
		// TODO: Need host card specific css
		// TODO: Link to user page
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<Link to={`/p/${this.props.id}`}>
							<div className="no-link">
								<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />

								<div id="username" className="profile">
									<h6 id="host-summary-name">{this.props.name}</h6>
								</div>

								{
									this.props.about === undefined ? undefined : (
										<div id="about" className="profile">
											<h6 id="host-summary-about-header">About {this.props.name.split(" ")[0]}</h6>
											<p id="host-summary-about">{this.props.about}</p>
										</div>
									)
								}

								{/* TODO: Seperate out re-usable components to their own folders */}
								{this.renderTopics()}
							</div>
						</Link>
					);
				}}
			</UserContext.Consumer>
		);
		// TODO: Maybe tags too. Could use tag card used in dashboard
	}
}
