import { User } from "@prisma/client";
import validator from "validator";
import { Context } from "../..";

interface UserInput {
  email: string;
  name: string;
  bio: string;
  password: string;
}

interface SignupResponse {
  userErrors: { message: string }[];
  user: User | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: UserInput,
    { prisma }: Context
  ): Promise<SignupResponse> => {
    const isValidEmail: boolean = validator.isEmail(email);
    if (!isValidEmail) {
      return {
        userErrors: [{ message: "Please add a valid email address" }],
        user: null,
      };
    }
    const isPasswordInvalid: boolean = validator.isLength(password, { min: 5 });
    if (!isPasswordInvalid) {
      return {
        userErrors: [{ message: "Please add a valid email address" }],
        user: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [{ message: "Please add a valid name/bio" }],
        user: null,
      };
    }

    return {
      userErrors: [],
      user: await prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      }),
    };
  },
};
