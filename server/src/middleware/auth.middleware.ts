import { Request, Response, NextFunction } from "express";
import { SessionInfo } from "../types/express";

export const checkUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req as any = vertrau broo req.session existiert
    const { userId, userRole } = (req as any).session;

    const isAuthenticated = !!userId && !!userRole;

    const sessionInfo: SessionInfo = {
      userId: userId ?? null,
      userRole: userRole ?? null,
      isAuthenticated,
    };

    (req as any).sessionInfo = sessionInfo;
    res.locals.sessionInfo = sessionInfo;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    next(err);
  }
};
