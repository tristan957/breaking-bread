/* global google */
/* tslint:disable:no-console */

import React from "react";
import Geosuggest from "react-geosuggest";

export default class GeoSuggest extends React.Component {
	public onSuggestSelect = (suggest: any): void => {
		console.log(suggest);
	}

	public render(): JSX.Element {
		return (
			<div>
				<Geosuggest
					placeholder={"Start typing!"}
					initialValue="Texas A&M"
					onSuggestSelect={this.onSuggestSelect}
					location={new google.maps.LatLng(40.741895, -73.989308)}
					radius={20} />
			</div>
		);
	}
}
