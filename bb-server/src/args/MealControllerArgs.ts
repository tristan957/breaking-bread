import { DeepPartial } from "typeorm";
import { Meal, Tag, Topic } from "../entities";
import { ILatLong } from "./CommonArgs";

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
	latLong: ILatLong;
	startTime: Date;
	endTime: Date;
	price: number;
	title: string;
	description?: string;
	imagePath?: string;
	maxGuests: number;
}

export interface IMealDeleteArgs {
	id: number;
}

export interface IMealToggleGuestArgs {
	mealID: number;
	guestID: number;
}

export interface IMealToggleRecipesArgs {
	mealID: number;
	recipeID: number;
}

export interface IMealEditArgs {
	id: number;
	latLong?: ILatLong;
	startTime?: Date;  // TODO: Email on time, price changes
	endTime?: Date;
	price?: number;
	title?: string;
	description?: string;
	imagePath?: string;
}
