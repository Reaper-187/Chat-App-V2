import { Router } from "express";

const { loginUser, registUser, logOutUser } = require("./user.controller");

const router = Router();

router.post("/login", loginUser);

router.post("/regist", registUser);

router.post("/logout", logOutUser);

export default router;
