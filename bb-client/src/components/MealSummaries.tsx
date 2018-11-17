import React from "react";
import MealSummaryContainer from "../containers/MealSummaryContainer";
import Meal from "../entities/Meal";

interface IMealSummariesProps {
	meals: Partial<Meal>[];
	showHosts?: boolean;
}

export default class MealSummaries extends React.Component<IMealSummariesProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{
						this.props.meals.map((meal, i) => {
							return (
								<li key={i}>
									<MealSummaryContainer
										showHost={this.props.showHosts || false}
										meal={meal}
									/>
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}
