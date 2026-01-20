import { Request, Response, Router } from "express";
import { isUserAuthenticated } from "../middleware/userAuthentication";
import { isUserRoleAuthorized } from "../middleware/userRoleAuthorization";


const router = Router();

router.get("/me", isUserAuthenticated, (req: Request, res: Response) => {
  return res.json({
    message: "Hello",
  });
});

router.get("/adminpanel", isUserAuthenticated,isUserRoleAuthorized("ADMIN"), (req: Request, res: Response) => {
  return res.json({
    message: "you have access to this route !",
  });
});

export default router;
