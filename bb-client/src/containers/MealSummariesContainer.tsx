import React from "react";
import Meal from "../entities/Meal";
import MealSummaryContainer from "./MealSummaryContainer";

interface IMealSummariesContainerProps {
	meals: Partial<Meal>[];
	onLoadMore?: Function;
	showHosts?: boolean;
}

export default class MealSummariesContainer extends React.Component<IMealSummariesContainerProps> {
	public UNSAFE_componentWillMount(): void {
		if (this.props.onLoadMore !== undefined) {
			window.onscroll = () => {
				if (this.props.onLoadMore !== undefined) {
					if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100) {
						this.props.onLoadMore();
					}
				}
			};
		}
	}

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
										mealID={meal.id!}
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
