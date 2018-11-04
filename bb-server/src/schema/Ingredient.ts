import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, Repository } from "typeorm";
import { IAppContext } from "../App";
import Ingredient from "../entities/Ingredient";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createIngredient(name: CreateIngredientInput!): Ingredient
    }

    extend type Query {
        getIngredient(input: GetIngredientInput!): Ingredient
    }

    type Ingredient {
        id: Int!
        name: String!
    }

    input CreateIngredientInput {
        name: String!
    }

    input GetIngredientInput {
        id: Int
        name: String
    }
`;

/**
 * Mutator Resolvers
 */

interface ICreateIngredient {
    input: DeepPartial<Ingredient>;
}

// tslint:disable-next-line: no-any
function _createIngredient(parent: any, args: ICreateIngredient, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Ingredient> | undefined> {
    return createIngredient(ctx, args.input);
}

export async function createIngredient(ctx: Context<IAppContext>, ingredient: DeepPartial<Ingredient>): Promise<DeepPartial<Ingredient>> {
    const ingredientsRepo: Repository<Ingredient> = await ctx.connection.getRepository(Ingredient);

    const foundIngredient: Ingredient | undefined = await ingredientsRepo.createQueryBuilder("ingredient")
        .where("ingredient.name = :name", { name: ingredient.name })
        .getOne();
    if (foundIngredient === undefined) {
        return ingredientsRepo.save(ingredient);
    } else {
        return foundIngredient;
    }
}

/**
 * Query Resolvers
 */

interface IGetIngredient {
    input: DeepPartial<Ingredient>;
}

// tslint:disable-next-line: no-any
function _getIngredient(parent: any, args: IGetIngredient, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Ingredient | undefined> {
    return getIngredient(ctx, args.input);
}

export async function getIngredient(ctx: Context<IAppContext>, ingredient: DeepPartial<Ingredient>): Promise<Ingredient | undefined> {
    if (ingredient.id !== undefined) {
        return ctx.connection
            .getRepository(Ingredient)
            .findOne({
                where: {
                    id: ingredient.id,
                },
            });
    }

    if (ingredient.name !== undefined) {
        return ctx.connection
            .getRepository(Ingredient)
            .findOne({
                where: {
                    name: ingredient.name,
                },
            });
    }

    return Promise.resolve(undefined);
}

export const resolvers: IResolvers = {
    Mutation: {
        createIngredient: _createIngredient,
    },
    Query: {
        getIngredient: _getIngredient,
    },
};
