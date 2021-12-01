import { Post } from ".prisma/client";
import { Context } from "..";

export const Query = {
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
