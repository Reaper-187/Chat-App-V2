import { Router } from "express";

const { createChat, getAllChats } = require("./chat.controller");
const router = Router();

router.post("/createChat", createChat); //zum erstellen eines Chats

router.get("/allChats", getAllChats); // user sieht chats mit denen er gesprochen hat (sidebar)

module.exports = router;
