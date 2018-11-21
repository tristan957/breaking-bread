import React from "react";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import Topic from "../entities/Topic";
import Item from "./Item";

interface IItemsProps {
	userID?: number;
	items: Partial<Topic | Tag | Allergy>[];
	monospace?: boolean;  // Default true
	leadingChar?: string;
	displayInline?: boolean;  // Default false
}

export default class Items extends React.Component<IItemsProps> {
	public render(): JSX.Element {
		let ulClasses = "no-style-list ";

		if (this.props.displayInline === true) {
			ulClasses += "list-inline";
		}

		return (
			<div>
				<ul className={ulClasses}>
					{this.props.items.map((item, i) => {
						return (
							<li key={i}>
								<Item
									id={item.id as number}
									name={item.name as string}
									monospace={this.props.monospace || false}
									leadingChar={this.props.leadingChar}
									displayInline={this.props.displayInline || false}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
