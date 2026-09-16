const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: " ",
    },
    checklist: [
      {
        text: {
          type: String,
          trim: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isTrashed: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    reminderAt: {
      type: Date,
      default: null,
    },
    lastViewedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label",
      },
    ],
    versionHistory: [
      {
        title: {
          type: String,
          default: "",
        },

        content: {
          type: String,
          default: "",
        },

        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", notesSchema);
module.exports = Note;
