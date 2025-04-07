import { Request, Response } from "express";
import { prismaClient } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/secrets";

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

export const signin = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }
    const isUserRegistered = await prismaClient.user.findFirst({
      where: { email },
    });
    if (!isUserRegistered) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      isUserRegistered.password!
    );
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password." });
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
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
