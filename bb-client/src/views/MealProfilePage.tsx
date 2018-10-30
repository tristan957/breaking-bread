import * as React from "react";
import "./resources/css/MealProfilePage.css";

type MealState = {
	image: string;
	person: object;
	quote: object;
};

type MealProps = {};

class MealProfile extends React.Component<MealProps, MealState> {
	constructor(Props: MealProps) {
	super(Props);
	this.state = {
		person: {
			name: "Taco",
			biography: "Tasty",
		},
		image: "http://static1.squarespace.com/static/55acc005e4b098e615cd80e2/t/57b057398419c2c454f09924/1471025851733/",
		quote: {
			content: "Beautiful things don\"t ask for attention",
			source: "The Secret Life of Walter Mitty",
		},
	};
  }
	public render(): JSX.Element {
		return(
			<div className="MealProfile">
			<Image src={this.state.image} />
			<Profile person={this.state.person} quote={this.state.quote} />
			</div>
		);
	}
}

function Image(props: any): any {
	return (
	  <div className="Image" style={{backgroundImage: `url( ${props.src} )`}}></div>
	);
}
function Profile(props: any): any {
  return (
	  <div className="Profile">
		<h1 className="Name">{props.person.name}</h1>
		<p className="Bio">{props.person.biography}</p>
		<div className="Quote">
		  <blockquote>&ldquo; {props.quote.content} &rdquo;</blockquote>
		  <div className="byline">&mdash; {props.quote.source}</div>
		</div>
	  </div>
	);
}

export default MealProfile;
