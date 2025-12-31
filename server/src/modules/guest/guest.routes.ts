import { Router } from "express";
// import { checkGuestExpiry } from "../../middleware/guest.auth.middleware";
const { guestAccess } = require("./guest.controller");
const router = Router();

router.post("/auth/guestLogin", guestAccess);

export default router;
