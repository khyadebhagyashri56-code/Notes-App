const express = require("express");
const crypto = require("crypto");

const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const { title, content, color, labels, checklist } = req.body;

    // Current note find karo
    const existingNote = await Note.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    if (color !== undefined) {
      updateData.color = color;
    }

    if (labels !== undefined) {
      updateData.labels = labels;
    }

    if (checklist !== undefined) {
      updateData.checklist = checklist;
    }

    // Sirf title ya content change hua ho tabhi
    // old version history me save karo
    const titleChanged = title !== undefined && title !== existingNote.title;

    const contentChanged =
      content !== undefined && content !== existingNote.content;

    if (titleChanged || contentChanged) {
      existingNote.versionHistory.push({
        title: existingNote.title,
        content: existingNote.content,
        savedAt: new Date(),
      });

      await existingNote.save();
    }

    // New changes update karo
    const noteUpdate = await Note.findOneAndUpdate(
      {
        _id: id,
        user: req.user.userId,
      },
      updateData,
      {
        returnDocument: "after",
      },
    );

    res.json(noteUpdate);
  } catch (error) {
    console.log("Update Note Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/notes/trash", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.userId,
      isTrashed: true,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch("/notes/:id/restore", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        isTrashed: false,
      },
      {
        returnDocument: "after",
      },
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }

    res.json(note);
  } catch (error) {
    console.log("Restore Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.userId,
      $and: [
        {
          $or: [{ isTrashed: false }, { isTrashed: { $exists: false } }],
        },

        {
          $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
        },
      ],
    })
      .populate("labels")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  //200  → Sab sahi hai
  // 201  → Naya data create hua
  // 404  → Data ya route nahi mila
  // 500  → Server ke andar error aa gaya

  //message is object which us sent to the frontned
});

router.get("/archive", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.userId,
      isArchived: true,
      isTrashed: false,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get recently viewed notes
router.get("/notes/recently-viewed", authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const notes = await Note.find({
      user: req.user.userId,
      lastViewedAt: { $ne: null },
    })
      .sort({ lastViewedAt: -1 })
      .limit(20);

    res.status(200).json(notes);
  } catch (error) {
    console.error("Recently viewed error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Mark note as recently viewed
router.patch("/notes/:id/view", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        lastViewedAt: new Date(),
      },
      {
        returnDocument: "after",
      },
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note marked as viewed",
      lastViewedAt: note.lastViewedAt,
    });
  } catch (error) {
    console.error("Mark Viewed Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { title, content, checklist } = req.body;

    const note = new Note({
      title,
      content,
      checklist,
      user: req.user.userId,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.patch("/notes/:id/trash", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        isTrashed: true,
      },
      {
        returnDocument: "after",
      },
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }

    res.json(note);
  } catch (error) {
    console.log("Trash Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }

    res.json({
      message: "Note deleted permanently",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/notes/favorites", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.userId,
      isFavorite: true,
      isTrashed: false,
      isArchived: false,
    })
      .populate("labels")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.log("Favorites Error:", error);
    res.status(500).json({
      message: "Failed to fetch favoriye notes",
    });
  }
});

router.patch("/notes/:id/archive", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        isArchived: true,
      },
      {
        returnDocument: "after",
      },
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }

    res.json(note);
  } catch (error) {
    console.log("Archive Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch("/notes/:id/unarchive", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        isArchived: false,
      },
      {
        returnDocument: "after",
      },
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }

    res.json(note);
  } catch (error) {
    console.log("Unarchive Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/notes/:id/reminder", async (req, res) => {
  try {
    const { id } = req.params;
    const { reminder } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      { reminder: reminder },
      { returnDocument: "after" },
    );
    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }
    res.json(note);
  } catch (error) {
    console.log("Reminder Error:", error);
    res.status(500).json({
      message: "Failed to set Reminder",
    });
  }
});

router.post("/notes/:id/share", authMiddleware, async (req, res) => {
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

    if (!note.shareId) {
      note.shareId = crypto.randomBytes(8).toString("hex");
    }

    note.isShared = true;

    await note.save();

    res.json({
      message: "Note shared successfully",
      shareId: note.shareId,
      shareUrl: `http://localhost:5173/shared/${note.shareId}`,
    });
  } catch (error) {
    console.error("Share Error:", error);

    res.status(500).json({
      message: "Failed to share note",
    });
  }
});

router.get("/notes/shared/:shareId", async (req, res) => {
  try {
    const note = await Note.findOne({
      shareId: req.params.shareId,
      isShared: true,
    }).select("title content color labels createdAt");

    if (!note) {
      return res.status(404).json({
        message: "Shared note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.error("Get Shared Note Error:", error);

    res.status(500).json({
      message: "Failed to get shared note",
    });
  }
});

router.patch("/notes/:id/pin", authMiddleware, async (req, res) => {
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
    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  } catch (error) {
    console.log("Pin Error:", error);
    res.status(500).json({
      message: "Failed to pin/unpin note",
    });
  }
});

router.patch("/notes/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!note) {
      return res.status(404).json({
        message: "Note not Found",
      });
    }
    note.isFavorite = !note.isFavorite;

    await note.save();
    res.json(note);
  } catch (error) {
    console.log("Favorite Error:", error);

    res.status(500).json({
      message: "Failed to add/remove favorite",
    });
  }
});

module.exports = router;
