import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, Repository } from "typeorm";
import { IAppContext } from "../App";
import Topic from "../entities/Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createTopic(name: CreateTopicInput!): Topic
    }

    extend type Query {
        getTopic(id: Int!): Topic
    }

    type Topic {
        id: Int!
        name: String!
    }

    input CreateTopicInput {
        name: String!
    }
`;

/**
 * Mutator Resolvers
 */

interface ICreateTopic {
    input: DeepPartial<Topic>;
}

// tslint:disable-next-line: no-any
function _createTopic(parent: any, args: ICreateTopic, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Topic>> {
    return createTopic(args.input, ctx);
}

export async function createTopic(topic: DeepPartial<Topic>, ctx: Context<IAppContext>): Promise<DeepPartial<Topic>> {
    const topicsRepo: Repository<Topic> = await ctx.connection.getRepository(Topic);

    const foundTopic: Topic | undefined = await topicsRepo.createQueryBuilder("topic")
        .where("topic.name = :name", { name: topic.name })
        .getOne();
    if (foundTopic === undefined) {
        return topicsRepo.save(topic);
    } else {
        return foundTopic;
    }
}

/**
 * Query Resolvers
 */

interface IGetTopic {
    id: number;
}

// tslint:disable-next-line: no-any
function _getTopic(parent: any, args: IGetTopic, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Topic | undefined> {
    return getTopic({ id: args.id }, ctx);
}

export async function getTopic(topic: DeepPartial<Topic>, ctx: Context<IAppContext>): Promise<Topic | undefined> {
    if (topic.id !== undefined) {
        return ctx.connection.getRepository(Topic).createQueryBuilder("topic")
            .where("topic.id = :id", { id: topic.id })
            .getOne();
    }

    if (topic.name !== undefined) {
        return ctx.connection.getRepository(Topic).createQueryBuilder("topic")
            .where("topic.name = :name", { name: topic.name })
            .getOne();
    }

    return Promise.resolve(undefined);
}

export const resolvers: IResolvers = {
    Mutation: {
        createTopic: _createTopic,
    },
    Query: {
        getTopic: _getTopic,
    },
};
