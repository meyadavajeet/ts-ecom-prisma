import { Request, Response } from "express";
import { prismaClient } from "../app";
import bcrypt from 'bcrypt'

interface SingupRequestBody {
  name: string;
  email: string;
  password: string;
}
interface LoginRequestBody {
  email: string;
  password: string;
}
// interface AuthRequest extends Request {
//   body: SingupRequestBody | LoginRequestBody;
// }
// interface AuthResponse extends Response {
//   user?: User;
//   token?: string;
//   error?: string;
// }
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
// interface Token {
//   id: string;
//   name: string;
//  email: string;
//   iat: number;
//   exp: number;
// }
// interface AuthMiddlewareRequest extends Request {
//   user?: Token;
// }
// interface AuthMiddlewareResponse extends Response {
//   user?: User;
//   token?: string;
//   error?: string;
// }
// interface AuthMiddlewareNextFunction {
//   (err?: any): void;
// }
// interface AuthMiddleware {
//   (req: AuthMiddlewareRequest, res: AuthMiddlewareResponse, next: AuthMiddlewareNextFunction): void;
// }

export const signup = async (
  req: Request<{}, {}, SingupRequestBody>,
  res: Response
) => {
  try {
    // get the data from the request body
    const { name, email, password } = req.body;
    // Basic validation (optional)
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "Name, email, and password are required." });
      return;
    }

    // Check if the user already exists
    const existingUser = await prismaClient.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      res.status(409).json({ error: "User already exists." });
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
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const login = (req: Request, res: Response) => {
  res.send("Login Controller");
};
