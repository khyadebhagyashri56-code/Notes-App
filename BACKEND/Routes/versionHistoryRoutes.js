const express = require("express");

const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/notes/:id/versions", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).select("versionHistory");

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note.versionHistory || []);
  } catch (error) {
    console.log("Version History Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


router.post(
  "/notes/:id/versions/:versionId/restore",
  authMiddleware,
  async (req, res) => {
    try {
      const note = await Note.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      const version = note.versionHistory.id(req.params.versionId);

      if (!version) {
        return res.status(404).json({
          message: "Version not found",
        });
      }

      // Current note ko history me save karna
      note.versionHistory.push({
        title: note.title,
        content: note.content,
        savedAt: new Date(),
      });

      // Selected old version ko current banana
      note.title = version.title;
      note.content = version.content;

      await note.save();

      res.json({
        message: "Version restored successfully",
        note,
      });
    } catch (error) {
      console.log("Restore Version Error:", error);

      res.status(500).json({
        message: error.message,
      });
    }
  },
);

module.exports = router;
