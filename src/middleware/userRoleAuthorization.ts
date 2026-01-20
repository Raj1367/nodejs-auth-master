import { NextFunction, Request, Response } from "express";

export const isUserRoleAuthorized = (role: "GENREAL" | "ADMIN") => {

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as any;
      const authUser = authReq.user;

      if (!authUser) {
        return res.status(401).json({
          success: false,
          error: true,
          message: "Unauthorized",
        });
      }

      if (authUser.role !== role) {
        return res.status(403).json({
          success: false,
          error: true,
          message:
            "Access denied you dont have rights to access this content ! ",
        });
      }
      next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: true,
        message: error.message || error || "Internal server error",
      });
    }
  };
  
};
