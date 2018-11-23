import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, Repository } from "typeorm";
import { IAppContext } from "../App";
import Allergy from "../entities/Allergy";

export const typeDef: DocumentNode = gql`
	extend type Mutation {
		createAllergy(name: CreateAllergyInput!): Allergy
	}

	extend type Query {
		getAllergy(input: GetAllergyInput!): Allergy
	}

	type Allergy {
		id: Int!
		name: String!
	}

	input CreateAllergyInput {
		name: String!
	}

	input GetAllergyInput {
		id: Int
		name: String
	}
`;

export const resolvers: IResolvers = {
	Mutation: {
		createAllergy: _createAllergy,
	},
	Query: {
		getAllergy: _getAllergy,
	},
};

/**
 * Mutation Resolvers
 */

interface ICreateAllergy {
	input: DeepPartial<Allergy>;
}

// tslint:disable-next-line: no-any
function _createAllergy(parent: any, args: ICreateAllergy, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Allergy>> {
	return createAllergy(ctx, args.input);
}

export async function createAllergy(ctx: Context<IAppContext>, allergy: DeepPartial<Allergy>): Promise<DeepPartial<Allergy>> {
	const allergyRepo: Repository<Allergy> = await ctx.connection.getRepository(Allergy);

	const foundAllergy: Allergy | undefined = await allergyRepo.createQueryBuilder("allergy")
		.where("allergy.name = :name", { name: allergy.name })
		.getOne();
	if (foundAllergy === undefined) {
		return allergyRepo.save(allergy);
	} else {
		return foundAllergy;
	}
}

/**
 * Query Resolvers
 */

interface IGetAllergy {
	input: DeepPartial<Allergy>;
}

// tslint:disable-next-line: no-any
function _getAllergy(parent: any, args: IGetAllergy, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Allergy | undefined> {
	return getAllergy(ctx, args.input);
}

export async function getAllergy(ctx: Context<IAppContext>, allergy: DeepPartial<Allergy>): Promise<Allergy | undefined> {
	if (allergy.id !== undefined) {
		return ctx.connection.getRepository(Allergy).createQueryBuilder("allergy")
			.where("allergy.id = :id", { id: allergy.id })
			.getOne();
	}

	if (allergy.name !== undefined) {
		return ctx.connection.getRepository(Allergy).createQueryBuilder("allergy")
			.where("allergy.name = :name", { name: allergy.name })
			.getOne();
	}

	return Promise.resolve(undefined);
}
