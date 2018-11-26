import React from "react";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import "./resources/css/LargeProfileSummary.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

interface ILargeProfileSummaryProps {
	id: number;
	imagePath?: string | null;
	name: string;
	reviewAverage?: number;
	numberOfFollowers?: number;
}

export default class LargeProfileSummary extends React.Component<ILargeProfileSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="large-profile-summary">
				{
					this.props.imagePath === null
						? (
							<img src={defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
						) : (
							<img src={this.props.imagePath || defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
						)
				}
				<div id="large-profile-summary-name">
					<Link to={`/p/${this.props.id}`} className="black-link-with-underline">
						{this.props.name}
					</Link>
				</div>
				{!this.props.reviewAverage
					? undefined
					: (
						<Rating
							readonly
							initialRating={this.props.reviewAverage}
						/>
					)
				}
				<div>
					<Button>Follow</Button>
				</div>
			</div>
		);
	}
}