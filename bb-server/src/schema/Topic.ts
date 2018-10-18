import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, getConnection, getRepository, Repository } from "typeorm";
import { IAppContext } from "../App";
import Topic from "../entities/Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createTopic(name: CreateTopicInput!): [Topic]
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

interface ICreateTopics {
    topic: DeepPartial<Topic>;
}

// tslint:disable-next-line: no-any
function _createTopic(parent: any, args: ICreateTopics, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Topic>> {
    return createTopic(args.topic);
}

export async function createTopic(topic: DeepPartial<Topic>): Promise<DeepPartial<Topic>> {
    const topicsRepo: Repository<Topic> = await getConnection().getRepository(Topic);

    const foundTopic: Topic | undefined = await topicsRepo.createQueryBuilder("topic")
        .where("topic.name = :name", { name: topic.name })
        .getOne();
    if (foundTopic === undefined) {
        return topicsRepo.save(topic);
    } else {
        return foundTopic;
    }
}

interface IGetTopic {
    input: DeepPartial<Topic>;
}

/**
 * Query Resolvers
 */

// tslint:disable-next-line: no-any
function _getTopic(parent: any, args: IGetTopic, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Topic | undefined> {
    return getTopic(args.input.id, args.input.name);
}

export async function getTopic(id: number | undefined = undefined, name: string | undefined = undefined): Promise<Topic | undefined> {
    if (typeof id === "number") {
        return getRepository(Topic).createQueryBuilder("topic")
            .where("topic.id = :id", { id })
            .getOne();
    }

    if (typeof name === "string") {
        return getRepository(Topic).createQueryBuilder("topic")
            .where("topic.name = :name", { name })
            .getOne();
    }

    return Promise.reject(undefined);
}

export const resolvers: IResolvers = {
    Mutation: {
        createTopic: _createTopic,
    },
    Query: {
        getTopic: _getTopic,
    },
};
