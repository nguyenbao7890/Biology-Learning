const express = require("express");
const { sendMessage } = require("../controllers/chatbot.controller");

const router = express.Router();

router.post("/message", sendMessage);

module.exports = router;
