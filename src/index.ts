import { ApolloServer } from "apollo-server";
import { Mutation, Query, Profile, Post, User } from "./resolvers";
import { typeDefs } from "./schema";
import { PrismaClient, Prisma } from "@prisma/client";
import { getToken } from "./utils/getToken";


const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number
  }
};

const resolvers = { Query, Mutation, Profile, Post, User };

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: any) => {
    const userInfo = await getToken(req.headers.authorization);
    return { prisma, userInfo };
  },
});

apolloServer
  .listen()
  .then(({ url }) => console.log(`Server running at ${url}`));
