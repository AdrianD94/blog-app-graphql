import { Post } from '.prisma/client';
import { Context } from '../index';

interface PostCreate {
    title: string,
    content: string
}

type PostPayloadType = {
    userErrors: { message: string }[],
    post: Post | null
}

export const Mutation = {
    postCreate: async (parent: unknown, { title, content }: PostCreate, { prisma }: Context): Promise<PostPayloadType> => {
        if (!title || !content) {
            return {
                userErrors: [{ message: 'You must provide a title and a content to create a post' }],
                post: null
            }
        }
        const post = await prisma.post.create({ data: { title, content, authorId: 1 } })
        return {
            userErrors: [],
            post
        }
    },
}

