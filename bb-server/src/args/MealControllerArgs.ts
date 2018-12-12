import { DeepPartial } from "typeorm";
import { Meal, Tag, Topic } from "../entities";
import { ILocation } from "./CommonArgs";

export interface IMealArgs {
	id: number;
}

export interface IFeedArgs {
	filterOptions?: {
		feedOptions: IMealFeedOptions;
	};
	first: number;
	after?: string;
}

export interface IMealEdge {
	node: DeepPartial<Meal>;
	cursor: string;
}

export interface IPageInfo {
	endCursor: string;
	hasNextPage: boolean;
}

export interface IMealFeedOptions {
	location: ILocationFilter;
	dateSpan: IDateSpanFilter;
	maxGuests?: number;
	tags?: DeepPartial<Tag>[];
	topics?: DeepPartial<Topic>[];
}

export interface ILocationFilter {
	distanceMI: number;
	fromLocation: string;
}

export interface IDateSpanFilter {
	from: Date;
	to: Date;
}

export interface IMealSaveArgs {
	location?: ILocation;
	startTime: Date;
	endTime: Date;
	price: number;
	title: string;
	description?: string;
	imagePath?: string;
	maxGuests: number;
}

export interface IMealDeleteArgs {
	mealID: number;
}

export interface IMealToggleGuestArgs {
	mealID: number;
	guestID?: number;
}

export interface IMealToggleRecipesArgs {
	mealID: number;
	recipeID: number;
}

export interface IMealEditArgs {
	id: number;
	location?: ILocation;
	startTime?: Date;  // TODO: Email on time, price changes
	endTime?: Date;
	price?: number;
	title?: string;
	description?: string;
	imagePath?: string;
}
