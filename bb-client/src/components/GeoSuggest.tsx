import React from "react";
import Geosuggest, { Suggest } from "react-geosuggest";

interface IGeoSuggestProps {
	defaultValue?: string;
	onSelect?: ((suggestion: Suggest) => void);
	onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void);
}

export default class GeoSuggest extends React.Component<IGeoSuggestProps> {
	public render(): JSX.Element {
		return (
			<div>
				<Geosuggest
					defaultValue={this.props.defaultValue}
					onSuggestSelect={this.props.onSelect}
					onChange={this.props.onChange}
					queryDelay={750}
					radius={20}
					location={new google.maps.LatLng(40.741895, -73989308)}
				/>
			</div>
		);
	}
}
// location={new google.map.LatLng(40.741895, -73989308)}
