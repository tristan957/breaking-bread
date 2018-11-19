// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import Topic from "../entities/Topic";
import { default as TopicComponent } from "./Item";
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
				<div>Favorite Topics</div>
				<ul className="list">
					{this.props.topics.map((topic, i) => {
						return (
							<li className="topic" key={i}>
								<TopicComponent id={topic.id as number} name={topic.name as string} />
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
			<Link to={`/p/${this.props.id}`}>
				<div className="no-link">
					<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
					<div id="username" className="profile"><h6><b>{this.props.name}</b></h6></div>

					{/* TODO: Seperate out re-usable components to their own folders */}
					{this.renderTopics()}
					{
						this.props.about === undefined ? undefined : (
							<div id="about" className="profile">
								<div>About:</div>
								<p>{this.props.about}</p>
							</div>
						)
					}
				</div>
			</Link>
		);
		// TODO: Maybe tags too. Could use tag card used in dashboard
	}
}
