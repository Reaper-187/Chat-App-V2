import { Router } from "express";

const { getAllChats, getAllUser } = require("./chat.controller");

const router = Router();

router.get("/allChats", getAllChats); // user sieht chats mit denen er gesprochen hat (sidebar)
router.get("/allUser", getAllUser);

export default router;
