import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/environment";

// Thay bằng secret thực tế của bạn (nên để trong .env)

export interface AuthRequest extends Request {
  user?: any; // Hoặc kiểu cụ thể nếu bạn muốn (vd: IUser)
}

export const authenticateToken: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // lấy token sau "Bearer"

  if (!token) {
    res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // gán payload vào req
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
