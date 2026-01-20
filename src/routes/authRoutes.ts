import { Router } from "express";
import { SignupController } from "../controllers/auth/signupController";
import { LoginController } from "../controllers/auth/loginController";
import { refreshTokenController } from "../controllers/auth/refeshTokenController";
import { VerifyEmailController } from "../controllers/auth/verifyEmaillController";
import { logoutController } from "../controllers/auth/logoutController";
import { forgotPasswordController } from "../controllers/auth/forgotPasswordController";
import { resetPasswordController } from "../controllers/auth/resetPasswordController";
import { googleAuthController } from "../controllers/auth/googleAuthController";
import googleAuthCallbackController from "../controllers/auth/googleAuthCallbackController";
import { isUserAuthenticated } from "../middleware/userAuthentication";
import { twoFactorAuthSetupController } from "../controllers/auth/twoFactorAuthSetupController";
import { verifyTwoFactorController } from "../controllers/auth/verifyTwoFactorAuthController";

const router = Router();

router.post("/auth/signup", SignupController);
router.post("/auth/login", LoginController);
router.get("/auth/verify-email", VerifyEmailController);
router.post("/auth/refreshtoken", refreshTokenController);
router.post("/auth/logout", logoutController);
router.post("/auth/forgot-password", forgotPasswordController);
router.post("/auth/reset-password", resetPasswordController);
router.post("/auth/2fa", isUserAuthenticated,twoFactorAuthSetupController);
router.post("/auth/2fa/verify", isUserAuthenticated,verifyTwoFactorController);

router.get("/auth/google", googleAuthController);
router.get("/auth/google/callback", googleAuthCallbackController);
export default router;
