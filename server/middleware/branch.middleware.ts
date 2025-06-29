import { NextFunction, RequestHandler, Response } from "express";
import { AuthRequest } from "./authMiddleware";

export const attachBranchId: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const branchId = req.headers["x-branch-id"];
  if (!branchId) res.status(400).send("Missing x-branch-id");
  req.user.branch = branchId as string;
  next();
};
