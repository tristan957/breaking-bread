// tslint:disable: no-unsafe-any
import React from "react";
import Topic from "../../../entities/Topic";
import TopicCard from "../../Dashboard/Left/TopicCard";
import "../../resources/css/ProfileCard.css";
import { default as defaultUserPic } from "../../resources/images/default_user_pic.png";

interface IHostCardProps {
	id: number;
	name: string;
	about?: string;
	imagePath?: string;
	topics: Partial<Topic>[];
}

export default class HostCard extends React.Component<IHostCardProps> {
	public render(): JSX.Element {
		// TODO: Need host card specific css
		// TODO: Link to user page
		return (
			<div id="profile-card" className="profile card">
				<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
				<div id="username" className="profile"><h6><b>{this.props.name}</b></h6></div>

				<div>Favorite Topics:</div>
				{/* TODO: Seperate out re-usable components to their own folders */}
				<ul className="list">
					{this.props.topics.map((topic, i) => {
						return (
							<li className="topic" key={i}>
								<TopicCard id={topic.id as number} name={topic.name as string} />
							</li>
						);
					})}
				</ul>

				<div id="about" className="profile">
					<div>About:</div>
					<p>{this.props.about}</p>
				</div>
			</div>
		);
		// TODO: Maybe tags too. Could use tag card used in dashboard
	}
}
