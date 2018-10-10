import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { getConnection } from "typeorm";
import Topic from "../entities/Topic";

export const typeDef: DocumentNode = gql`
    extend type Query {
        topic(id: Int!): Topic
    }

    type Topic {
        id: Int!
        name: String!
    }
`;

interface ITopicQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        topic: (parent, args: ITopicQuery, context, info) => {
            return getConnection()
                .getRepository(Topic)
                .createQueryBuilder("topic")
                .where(`"topic"."id" = ${args.id}`)
                .getOne()
                .then(topic => {
                    if (topic === undefined) { return undefined; }

                    return topic;
                });
        },
    },
};
