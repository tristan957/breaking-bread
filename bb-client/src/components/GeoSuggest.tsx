import React from "react";
import Geosuggest from "react-geosuggest";

interface IGeoSuggestProps {
	onChange: React.ChangeEventHandler;
}

export default class GeoSuggest extends React.Component<IGeoSuggestProps> {
	public onSuggestSelect = (suggest: any): void => {
		console.log(suggest);
	}

	public render(): JSX.Element {
		return (
			<div>
				<Geosuggest
					onChange={this.props.onChange}
					onSuggestSelect={this.onSuggestSelect}
					radius={20} />
			</div>
		);
	}
}
// location={new google.map.LatLng(40.741895, -73989308)}
