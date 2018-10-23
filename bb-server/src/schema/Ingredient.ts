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
        getIngredient(id: Int!): Ingredient
    }

    type Ingredient {
        id: Int!
        name: String!
        allergies: [Allergy]!
    }

    input CreateIngredientInput {
        name: String!
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
    return createIngredient(args.input, ctx);
}

export async function createIngredient(ingredient: DeepPartial<Ingredient>, ctx: Context<IAppContext>): Promise<DeepPartial<Ingredient>> {
    const ingredientsRepo: Repository<Ingredient> = await ctx.connection.getRepository(Ingredient);

    // TODO: Check for allergies by name
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
    id: number;
}

// tslint:disable-next-line: no-any
function _getIngredient(parent: any, args: IGetIngredient, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Ingredient | undefined> {
    return getIngredient({ id: args.id }, ctx);
}

export async function getIngredient(ingredient: DeepPartial<Ingredient>, ctx: Context<IAppContext>): Promise<Ingredient | undefined> {
    const neededRelations: string[] = ["allergies"];
    if (ingredient.id !== undefined) {
        return ctx.connection
            .getRepository(Ingredient)
            .findOne({
                where: {
                    id: ingredient.id,
                },
                relations: neededRelations,
            });
    }

    if (ingredient.name !== undefined) {
        return ctx.connection
            .getRepository(Ingredient)
            .findOne({
                where: {
                    name: ingredient.name,
                },
                relations: neededRelations,
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
