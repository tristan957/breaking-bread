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
    }

    type Tag {
        id: Int!
        name: String!
    }

    input GetTagInput {
        id: Int
        name: String
    }

    input CreateTagInput {
        name: String!
    }
`;

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

export async function getTag(ctx: Context<IAppContext>, tag: DeepPartial<Tag>): Promise<Tag | undefined> {
	if (tag.id !== undefined) {
		return ctx.connection.getRepository(Tag).createQueryBuilder("tag")
			.where("tag.id = :id", { id: tag.id })
			.getOne();
	}

	if (tag.name !== undefined) {
		return ctx.connection.getRepository(Tag).createQueryBuilder("tag")
			.where("tag.name = :name", { name: tag.name })
			.getOne();
	}

	return Promise.resolve(undefined);
}

export const resolvers: IResolvers = {
	Mutation: {
		createTag: _createTag,
	},
	Query: {
		getTag: _getTag,
	},
};
