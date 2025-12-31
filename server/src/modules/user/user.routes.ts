import { Router } from "express";
import { checkUserAuth } from "../../middleware/auth.middleware";
import { checkGuestExpiry } from "../../middleware/guest.auth.middleware";

const {
  userInfo,
  loginUser,
  registUser,
  logOutUser,
} = require("./user.controller");

const router = Router();

router.get("/userInfo", checkUserAuth, checkGuestExpiry, userInfo);

router.post("/login", loginUser);

router.post("/regist", registUser);

router.post("/logout", logOutUser);

export default router;
