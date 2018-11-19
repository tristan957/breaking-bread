import React from "react";
import Meal from "../entities/Meal";
import MealSummaryContainer from "./MealSummaryContainer";

interface IMealSummariesContainerProps {
	meals: Partial<Meal>[];
	showHosts?: boolean;
}

export default class MealSummariesContainer extends React.Component<IMealSummariesContainerProps> {
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
