import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLScalarType } from "graphql";
import { Kind, ValueNode } from "graphql/language";

export const typeDef: DocumentNode = gql`
	scalar DateTime
`;

export const resolvers: IResolvers = {
    DateTime: new GraphQLScalarType({
        name: "DateTime",
        description: "DateTime represents Postgres date type",
        parseValue(value: number): Date {
            return new Date(value);
        },
        serialize(value: Date): number {
            return value.getTime();
        },
        parseLiteral(ast: ValueNode): Date | undefined {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value);
            }
            return undefined;
        },
    }),
};
