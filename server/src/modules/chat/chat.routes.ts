import { Router } from "express";

const { getAllChats } = require("./chat.controller");

const router = Router();

router.get("/allChats", getAllChats); // user sieht chats mit denen er gesprochen hat (sidebar)

export default router;
