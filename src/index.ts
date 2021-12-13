import { ApolloServer } from "apollo-server";
import { Mutation, Query } from "./resolvers";
import { typeDefs } from "./schema";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
};

const resolvers = { Query, Mutation };

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { prisma };
  },
});

apolloServer
  .listen()
  .then(({ url }) => console.log(`Server running at ${url}`));
