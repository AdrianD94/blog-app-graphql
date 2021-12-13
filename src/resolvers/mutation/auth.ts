import { JWT_SECRET } from "./../../keys";
import validator from "validator";
import { Context } from "../..";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";

interface UserInput {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface UserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: UserInput,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const isValidEmail: boolean = validator.isEmail(email);
    if (!isValidEmail) {
      return {
        userErrors: [{ message: "Please add a valid email address" }],
        token: null,
      };
    }
    const isPasswordInvalid: boolean = validator.isLength(password, { min: 5 });
    if (!isPasswordInvalid) {
      return {
        userErrors: [{ message: "Please add a valid email address" }],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [{ message: "Please add a valid name/bio" }],
        token: null,
      };
    }
    const hashedPassword: string = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio,
      },
    });
    const token = JWT.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: 3600,
    });
    return {
      userErrors: [],
      token,
    };
  },
  signin: async (
    _: any,
    { credentials }: { credentials: UserInput["credentials"] },
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        userErrors: [
          {
            message: "Invalid email/password",
          },
        ],
        token: null,
      };
    }
    const passwordMatches: boolean = await bcryptjs.compare(
      password,
      user.password
    );
    if (!passwordMatches) {
      return {
        userErrors: [
          {
            message: "Invalid email/password",
          },
        ],
        token: null,
      };
    }
    const token = await JWT.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: 3600,
    });
    return {
      userErrors: [],
      token,
    };
  },
};
