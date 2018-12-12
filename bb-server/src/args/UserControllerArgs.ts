import { DeepPartial } from "typeorm";
import { Tag, Topic } from "../entities";
import { ILocation } from "./CommonArgs";

export interface IUserArgs {
	id: number;
}

export interface IUserSubArgs {
	sub: string;
}

export interface IUserSaveArgs {
	firstName: string;
	lastName: string;
	imagePath?: string;
	about?: string;
	location: ILocation;
	email: string;
	phoneNumber: string;
	oAuthSub: string;
}

export interface IUserEditArgs {
	firstName?: string;
	lastName?: string;
	imagePath?: string;
	about?: string;
	location?: ILocation;
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
