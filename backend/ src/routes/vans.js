import express from "express";
const router = express.Router();

// Fake data كبداية
const vans = [
  { id: 1, type: "Compact", price: 50 },
  { id: 2, type: "Standard", price: 70 },
  { id: 3, type: "Large", price: 100 },
];

// GET all vans
router.get("/", (req, res) => {
  res.json(vans);
});

// GET van by ID
router.get("/:id", (req, res) => {
  const van = vans.find(v => v.id == req.params.id);
  van ? res.json(van) : res.status(404).json({ error: "Van not found" });
});

export default router;
