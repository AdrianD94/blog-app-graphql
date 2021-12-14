import { Post, Prisma } from ".prisma/client";
import { Context } from "../..";

interface PostArgs {
  post: { title?: string; content?: string };
}

type PostPayloadType = {
  userErrors: { message: string }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
};

export const postResolvers = {
  postCreate: async (
    parent: unknown,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if(!userInfo){
      return {
        userErrors: [
          {
            message: "Unauthorized",
          },
        ],
        post: null,
      };
    }
    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and a content to create a post",
          },
        ],
        post: null,
      };
    }
    return {
      userErrors: [],
      post: await prisma.post.create({
        data: { title, content, authorId: 1 },
      }),
    };
  },
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs["post"] },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = post;
    if (!title && !content) {
      return {
        userErrors: [
          {
            message:
              "You must provide atleast a title or a content,in order to update the post",
          },
        ],
        post: null,
      };
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    let payloadToUpdate = {
      title,
      content,
    };
    if (!content) {
      delete payloadToUpdate.content;
    }
    if (!title) {
      delete payloadToUpdate.title;
    }
    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    return {
      userErrors: [],
      post: existingPost,
    };
  }
}
