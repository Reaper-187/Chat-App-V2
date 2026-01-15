import { Router } from "express";
import { checkUserAuth } from "../../middleware/auth.middleware";
import { checkGuestExpiry } from "../../middleware/guest.auth.middleware";

const {
  userInfo,
  loginUser,
  registUser,
  logOutUser,
  emailVerify,
} = require("./user.controller");

const router = Router();

router.get("/userInfo", checkUserAuth, checkGuestExpiry, userInfo);

router.post("/login", loginUser);

router.get("/verifyUser", emailVerify);

router.post("/regist", registUser);

router.post("/logout", logOutUser);

export default router;
