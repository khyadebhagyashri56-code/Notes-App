const express = require("express");
const router = express.Router();

const Reminder = require("../models/Reminder");

router.post("/", async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    if (!title || !date || !time) {
      return res.status(400).json({
        message: "Title, date and time are required",
      });
    }
    const reminder = await Reminder.create({
      title,
      description,
      date,
      time,
    });
    res.status(201).json(reminder);
  } catch (error) {
    console.error("Create reminder error :", error);
    res.status(500).json({
      message: "Failed to create reminder",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({
      date: 1,
      time: 1,
    });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Get reminders error:", error);
    res.status(500).json({
      message: "Failed to fetch reminders",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }
    res.status(200).json({
      message: "Reminder deleted successfully",
    });
  } catch {
    console.error("Delete remider error:", error);
    res.status(500).json({
      message: "failed to delte reminder",
      error: error.message,
    });
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      {
        completed: true,
      },
      {
        new: true,
      },
    );
    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not Found",
      });
    }
    res.status(200).json(reminder);
  } catch {
    res.status(500).json({
      message: "Failed to complete reminder",
      error: error.message,
    });
  }
});

router.delete("/reminders/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true },
      { new: true },
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
