import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/secrets";
import { BadRequestException } from "../exceptions/badrequest.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";
import { InternalServerException } from "../exceptions/internalserver.exceptions";
import { UnprocessableEntity } from "../exceptions/validation.exception";
import { LoginSchema, SignupSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/notfound.exceptions";

interface SingupRequestBody {
  name: string;
  email: string;
  password: string;
}
interface LoginRequestBody {
  email: string;
  password: string;
}
export const signup = async (
  req: Request<{}, {}, SingupRequestBody>,
  res: Response,
  next: NextFunction
) => {
  // Validate request body using Zod schema
  SignupSchema.parse(req.body);
  // get the data from the request body
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await prismaClient.user.findFirst({
    where: { email },
  });
  if (existingUser) {
    next(
      new BadRequestException(
        "User already exists.",
        ErrorCode.USER_ALREADY_EXISTS
      )
    );
    return;
  }

  // Create new user
  const hashedPassword = await bcrypt.hash(String(password), 10);
  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Optionally omit the password field in response
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
};

export const signin = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  LoginSchema.parse(req.body);
  const { email, password } = req.body;
  const isUserRegistered = await prismaClient.user.findFirst({
    where: { email },
  });
  if (!isUserRegistered) {
    next(new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND));
    return;
  }
  const isPasswordValid = await bcrypt.compare(
    password.toString(),
    isUserRegistered.password!
  );
  if (!isPasswordValid) {
    next(
      new BadRequestException(
        "Invalid email or password.",
        ErrorCode.INVALID_CREDENTIALS
      )
    );
    return;
  }
  // Optionally omit the password field in response
  const { password: _, ...userWithoutPassword } = isUserRegistered;

  // Generate JWT token (optional)
  const token = jwt.sign({ id: isUserRegistered.id }, JWT_SECRET, {
    expiresIn: "24h",
  });
  // res.cookie("token", token, { httpOnly: true, secure: true });
  res
    .status(200)
    .json({ message: "Login successful", user: userWithoutPassword, token });
};
