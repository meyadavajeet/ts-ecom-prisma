import { NextFunction, Request, Response } from "express";


const authMiddleware = (req : Request,res : Response, next : NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Verify the token (this is a placeholder, implement your own verification logic)
  // For example, you can use jwt.verify(token, secretKey) if you're using JWT
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (!decoded) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  // Attach user information to the request object

}

export default authMiddleware;