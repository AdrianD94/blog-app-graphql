import { Post } from ".prisma/client";
import { Context } from "..";

export const Query = {
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;
    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },
  posts: async (_: any, __: any, { prisma }: Context) => {
    const posts: Post[] = await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });
    return posts;
  },
};
