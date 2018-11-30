import { DeepPartial } from "typeorm";
import { Tag, Topic } from "../entities";
import { ILatLong } from "./CommonArgs";

export interface IUserArgs {
	id: number;
}

export interface IUserSaveArgs {
	firstName: string;
	lastName: string;
	imagePath?: string;
	about?: string;
	latLong: ILatLong;
	email: string;
	phoneNumber: string;
	oAuthSub: string;
}

export interface IUserEditArgs {
	imagePath?: string;
	about?: string;
	latLong?: ILatLong;
	email?: string;
	phoneNumber?: string;
}

export interface IUserReviewArgs {
	id: number;
}

export interface IUserReviewSaveArgs {
	rating: number;
	description?: string;
	subjectID: number;
}

export interface IUserReviewEditArgs {
	id: number;
	rating?: number;
	description?: string;
}

export interface IUserToggleTagsArgs {
	tags: DeepPartial<Tag>[];
}

export interface IUserToggleTopiclistArgs {
	topics: DeepPartial<Topic>[];
}
