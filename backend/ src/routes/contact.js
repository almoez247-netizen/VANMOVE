const express = require("express");
const router = express.Router();
const { prisma } = require("../db");
const { required } = require("../utils/validators");

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST create message
router.post("/", async (req, res) => {
  const check = required(["name", "email", "subject", "body"], req.body);
  if (!check.ok) return res.status(400).json({ error: "Missing fields", fields: check.missing });

  try {
    const msg = await prisma.message.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        body: req.body.body
      }
    });
    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ error: "Failed to create message" });
  }
});

module.exports = router;
