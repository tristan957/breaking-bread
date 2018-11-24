import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, Repository } from "typeorm";
import { IAppContext } from "../App";
import Tag from "../entities/Tag";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createTag(name: CreateTagInput!): Tag
    }

    extend type Query {
        getTag(input: GetTagInput!): Tag
		getTags: [Tag]
    }

    type Tag {
        id: Int!
        name: String!
		associatedRecipes: [Recipe]
		followers: [User]
    }

    input GetTagInput {
        id: Int
        name: String
    }

    input CreateTagInput {
        name: String!
    }
`;

export const resolvers: IResolvers = {
	Mutation: {
		createTag: _createTag,
	},
	Query: {
		getTag: _getTag,
		getTags: _getTags,
	},
};

/**
 * Mutator Resolvers
 */

interface ICreateTag {
	input: DeepPartial<Tag>;
}

// tslint:disable-next-line: no-any
function _createTag(parent: any, args: ICreateTag, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Tag>> {
	return createTag(ctx, args.input);
}

export async function createTag(ctx: Context<IAppContext>, tag: DeepPartial<Tag>): Promise<DeepPartial<Tag>> {
	const tagRepo: Repository<Tag> = await ctx.connection.getRepository(Tag);

	const foundTag: Tag | undefined = await tagRepo.createQueryBuilder("tag")
		.where("tag.name = :name", { name: tag.name })
		.getOne();
	if (foundTag === undefined) {
		return tagRepo.save(tag);
	} else {
		return foundTag;
	}
}

/**
 * Query Resolvers
 */

interface IGetTag {
	input: DeepPartial<Tag>;
}

// tslint:disable-next-line: no-any
function _getTag(parent: any, args: IGetTag, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Tag | undefined> {
	return getTag(ctx, args.input);
}

// tslint:disable-next-line:no-inferrable-types
export async function getTag(ctx: Context<IAppContext>, tag: DeepPartial<Tag>, withRelations: boolean = true): Promise<Tag | undefined> {
	let neededRelations: string[] = [];
	if (withRelations) {
		neededRelations = ["associatedRecipes", "followedBy"];
	}

	if (tag.id !== undefined) {
		return ctx.connection
			.getRepository(Tag)
			.findOne({
				where: {
					id: tag.id,
				},
				relations: neededRelations,
			});
	}

	if (tag.name !== undefined) {
		return ctx.connection
			.getRepository(Tag)
			.findOne({
				where: {
					name: tag.name,
				},
				relations: neededRelations,
			});
	}

	return Promise.resolve(undefined);
}

// tslint:disable-next-line: no-any
function _getTags(parent: any, args: any, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Tag[]> {
	const neededRelations: string[] = ["associatedRecipes", "followers"];
	return ctx.connection
		.getRepository(Tag)
		.find({
			relations: neededRelations,
		});
}
