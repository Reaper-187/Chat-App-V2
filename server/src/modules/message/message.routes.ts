import { Router } from "express";

const { sendMessage, getMessage } = require("./message.controller");
const router = Router();

router.post("/sendMessages", sendMessage);

router.get("/messages/chatId", getMessage);

export default router;
