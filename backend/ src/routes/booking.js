const express = require("express");
const router = express.Router();
const { prisma } = require("../db");
const { required } = require("../utils/validators");

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { Van: true }
    });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// GET booking by id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { Van: true }
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

// POST create booking
router.post("/", async (req, res) => {
  const fields = ["vanId", "userName", "userEmail", "pickup", "dropoff", "startDate", "endDate"];
  const check = required(fields, req.body);
  if (!check.ok) return res.status(400).json({ error: "Missing fields", fields: check.missing });

  try {
    const booking = await prisma.booking.create({
      data: {
        vanId: Number(req.body.vanId),
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        pickup: req.body.pickup,
        dropoff: req.body.dropoff,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        status: "confirmed"
      }
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// PATCH update booking status
router.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  try {
    const updated = await prisma.booking.update({ where: { id }, data: { status } });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

module.exports = router;
