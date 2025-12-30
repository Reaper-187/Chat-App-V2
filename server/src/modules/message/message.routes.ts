import { Router } from "express";

const { sendMessage, getMessage } = require("./message.controller");
const router = Router();

router.post("/messages", sendMessage);

router.get("/messages/:chatId", getMessage);

module.exports = router;
