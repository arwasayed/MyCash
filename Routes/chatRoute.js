// // routes/chatRoute.js
const express = require("express");
const router = express.Router();
const { sendMessage,getChatHistory } = require("../Controllers/chatController");
const { protect } = require('../middlewares/authMiddleware');

router.post("/chat",protect, async (req, res) => {
  await sendMessage(req, res);
});
router.get("/chat/history", async (req, res) => {
  await getChatHistory(req, res);
});
module.exports = router;