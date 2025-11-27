const express = require("express");
const router = express.Router();
const { prisma } = require("../db");
const { required } = require("../utils/validators");

// GET by trackingId
router.get("/:trackingId", async (req, res) => {
  const trackingId = req.params.trackingId;
  try {
    const track = await prisma.tracking.findUnique({
      where: { trackingId },
      include: { Van: true }
    });
    if (!track) return res.status(404).json({ error: "Tracking not found" });
    res.json(track);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch tracking" });
  }
});

// PATCH update coordinates
router.patch("/:trackingId", async (req, res) => {
  const trackingId = req.params.trackingId;
  const check = required(["lastLat", "lastLng"], req.body);
  if (!check.ok) return res.status(400).json({ error: "Missing fields", fields: check.missing });

  try {
    const updated = await prisma.tracking.update({
      where: { trackingId },
      data: {
        lastLat: Number(req.body.lastLat),
        lastLng: Number(req.body.lastLng)
      }
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Failed to update tracking" });
  }
});

module.exports = router;
