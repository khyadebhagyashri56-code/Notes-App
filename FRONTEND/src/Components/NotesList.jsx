import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModel";
import VersionHistoryModal from "./VersionHistoryModal";

import {
  Pencil,
  Trash2,
  Archive,
  MoreHorizontal,
  Bell,
  Pin,
  Palette,
  RotateCcw,
  Trash,
  Check,
  Share2,
  History,
  Star,
} from "lucide-react";

function NotesList({
  notes,
  setEdit,
  setNotes,
  isTrash,
  isArchive,
  search,
  setToast,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [permanentDeletedId, setPermanentDeletedId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [shareNoteData, setShareNoteData] = useState(null);

  // COLOR PICKER STATE
  const [showColorPickerId, setShowColorPickerId] = useState(null);
  const [versionHistoryNoteId, setVersionHistoryNoteId] = useState(null);

  const navigate = useNavigate();

  // NOTE COLORS
  const colors = [
    "#ffffff",
    "#fef3c7",
    "#fde2e2",
    "#dcfce7",
    "#dbeafe",
    "#e9d5ff",
    "#ffe4e6",
    "#e5e7eb",
  ];

  // ===============================
  // NOTES → MOVE TO TRASH
  // ===============================

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/notes/${id}/trash`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) {
        throw new Error("Failed to move note to trash");
      } // Note ko current list se remove karo
      setNotes((prev) => prev.filter((note) => note._id !== id)); // Confirmation modal close karo
      setDeleteId(null);
    } catch (error) {
      console.error("Trash Error:", error);
    }
  };

  // ===============================
  // PIN / UNPIN
  // ===============================

  const togglePin = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}/pin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? data : note)),
      );
    } catch (error) {
      console.log("Pin Error: ", error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}/favorite`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log("Favorite API Response:", data);

      if (!response.ok) {
        console.log(data.message || "Failed to update favorite");
        return;
      }
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, isFavorite: data.isFavorite } : note,
        ),
      );
      setToast({
        message: data.isFavorite
          ? "Note added to Favorites ⭐"
          : "Note removed from Favorites",
        type: "success",
      });
    } catch (error) {
      console.log("Favorite Error:", error);
    }
  };
  // ===============================
  // CHANGE NOTE COLOR
  // ===============================

  const changeNoteColor = async (id, color) => {
    try {
      const token = localStorage.getItem("token");

      // Pehle purana note save karenge
      const oldNotes = [...notes];

      // UI mein immediately color change
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id
            ? {
                ...note,
                color: color,
              }
            : note,
        ),
      );

      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          color: color,
        }),
      });

      const updatedNote = await response.json();

      // Backend mein error
      if (!response.ok) {
        alert(updatedNote.message || "Failed to change color");

        // UI ko old state par wapas le aao
        setNotes(oldNotes);

        return;
      }

      // Backend se updated note successfully mila
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note)),
      );

      // Color picker aur menu close
      setShowColorPickerId(null);
      setOpenMenuId(null);
    } catch (error) {
      console.log("Color Error:", error);

      // Request fail hone par old notes restore
      setNotes((prevNotes) => {
        return prevNotes;
      });
    }
  };
  // ===============================
  // ARCHIVE
  // ===============================

  const archiveNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}/archive`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to archive note");
      }

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Archive Error:", error);
    }
  };

  // ===============================
  // UNARCHIVE
  // ===============================

  const unarchiveNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}/unarchive`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to unarchive note");
      }

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Unarchive Error:", error);
    }
  };

  // ===============================
  // RESTORE NOTE
  // ===============================

  const restoreNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to restore note");
      }

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Restore Error:", error);
    }
  };

  // {DELETE FOREVER}

  const deleteForever = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setNotes((prev) => prev.filter((note) => note._id !== id));
      setPermanentDeletedId(null);
    } catch (error) {
      console.log("Error Delete Forever:", error);
    }
  };

  // ===============================
  // SET REMINDER
  // ===============================

  const handleReminder = (note) => {
    navigate("/reminder", {
      state: {
        noteId: note._id,
        title: note.title,
        description: note.content,
      },
    });
  };
  const shareNote = async (note) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${note._id}/share`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to share note");
      }

      setShareNoteData({
        note: note,
        shareUrl: data.shareUrl,
      });
    } catch (error) {
      console.log("Share Error:", error);
    }
  };

  // ===============================
  // EMPTY STATE
  // ===============================

  if (notes.length === 0) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-white px-4 transition-colors duration-300 dark:bg-[#202124]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-gray-100 dark:bg-[#303134]">
            {isTrash ? (
              <Trash2
                className="h-11 w-11 text-gray-400 dark:text-gray-500"
                strokeWidth={1.5}
              />
            ) : isArchive ? (
              <Archive
                className="h-11 w-11 text-gray-400 dark:text-gray-500"
                strokeWidth={1.5}
              />
            ) : (
              <Pencil
                className="h-11 w-11 text-gray-400 dark:text-gray-500"
                strokeWidth={1.5}
              />
            )}
          </div>

          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {isTrash
              ? "Trash is empty"
              : isArchive
                ? "Archive is empty"
                : "No notes yet"}
          </h2>

          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            {isTrash
              ? "Notes moved to trash will appear here."
              : isArchive
                ? "Archived notes will appear here."
                : "Notes you add will appear here."}
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // NOTES LIST
  // ===============================

  return (
    <div className="min-h-screen flex-1 bg-white px-4 py-6 transition-colors duration-300 dark:bg-[#202124] sm:px-6 lg:px-8">
      {/* NOTES GRID */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {notes.map((note) => {
          // DARK MODE NOTE BACKGROUND
          const noteBackground =
            note.color && note.color !== "#ffffff" ? note.color : undefined;

          return (
            <div
              key={note._id}
              onClick={() => {
                navigate(`/view-note/${note._id}`);
              }}
              className={`group relative flex min-h-45 cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#3c4043] dark:bg-[#2d2e30] ${
                openMenuId === note._id || showColorPickerId === note._id
                  ? "z-50"
                  : "z-0"
              }`}
              style={noteBackground ? { backgroundColor: noteBackground } : {}}
            >
              {/* ================= PIN BADGE ================= */}

              {note.isPinned && (
                <div className="mb-4 flex items-center gap-1.5">
                  <div className="flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    <Pin size={12} />

                    <span>Pinned</span>
                  </div>
                </div>
              )}

              {!isTrash && !isArchive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(note._id);
                  }}
                  title={
                    note.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                  }
                  className="
      absolute right-14 top-4
      rounded-full
      p-2
      transition
      hover:bg-gray-100
      dark:hover:bg-[#3c4043]
    "
                >
                  <Star
                    size={20}
                    strokeWidth={2}
                    fill={note.isFavorite ? "#eab308" : "none"}
                    stroke={note.isFavorite ? "#eab308" : "currentColor"}
                    className={
                      note.isFavorite
                        ? "text-yellow-500"
                        : "text-gray-400 dark:text-gray-400"
                    }
                  />
                </button>
              )}

              {/* ================= THREE DOT MENU ================= */}

              {!isTrash && !isArchive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === note._id ? null : note._id);

                    setShowColorPickerId(null);
                  }}
                  className="
                    absolute right-4 top-4
                    rounded-full
                    p-2
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    hover:text-gray-800
                    dark:text-gray-400
                    dark:hover:bg-[#3c4043]
                    dark:hover:text-white
                  "
                >
                  <MoreHorizontal size={21} />
                </button>
              )}

              {/* ================= DROPDOWN MENU ================= */}

              {openMenuId === note._id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="
                    absolute right-4 top-14 z-100
                    w-52
                    overflow-visible
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    py-2
                    shadow-xl

                    dark:border-[#3c4043]
                    dark:bg-[#303134]
                  "
                >
                  {/* EDIT */}

                  <button
                    onClick={() => {
                      navigate(`/edit-note/${note._id}`);
                      setOpenMenuId(null);
                    }}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-100

                      dark:text-gray-200
                      dark:hover:bg-[#3c4043]
                    "
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  {/* CHANGE COLOR */}

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowColorPickerId(
                          showColorPickerId === note._id ? null : note._id,
                        )
                      }
                      className="
                        flex w-full items-center gap-3
                        px-4 py-3
                        text-left text-sm
                        text-gray-700
                        transition
                        hover:bg-gray-100

                        dark:text-gray-200
                        dark:hover:bg-[#3c4043]
                      "
                    >
                      <Palette size={17} />
                      Change Color
                    </button>

                    {/* COLOR PICKER */}

                    {showColorPickerId === note._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="
                          absolute right-[calc(100%+10px)] top-1/2 z-200
                          w-56 -translate-y-1/2
                          rounded-2xl
                          border border-gray-200
                          bg-white
                          p-4
                          shadow-[0_14px_35px_rgba(0,0,0,0.16)]
                          ring-1 ring-black/5
                          dark:border-[#45474a]
                          dark:bg-[#303134]
                          dark:ring-white/5
                        "
                      >
                        {/* COLOR PICKER HEADER */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              Choose note color
                            </p>

                            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                              8 colors
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                            Give this note a new look
                          </p>
                        </div>

                        {/* COLOR GRID */}
                        <div className="grid grid-cols-4 gap-3">
                          {colors.map((color) => {
                            const isSelected = note.color === color;

                            return (
                              <button
                                key={color}
                                onClick={() => changeNoteColor(note._id, color)}
                                aria-label={`Choose ${color} note color`}
                                title={color}
                                className={`
                                  group relative flex h-10 w-10 items-center justify-center
                                  rounded-full
                                  border-2
                                  transition-all duration-200
                                  hover:scale-110
                                  active:scale-95
                                  ${
                                    isSelected
                                      ? "border-white shadow-md ring-2 ring-blue-500 ring-offset-2 dark:border-[#303134] dark:ring-blue-400 dark:ring-offset-[#303134]"
                                      : "border-black/10 shadow-sm hover:shadow-md dark:border-white/10"
                                  }
                                `}
                                style={{ backgroundColor: color }}
                              >
                                {isSelected && (
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/15">
                                    <Check
                                      size={13}
                                      strokeWidth={3}
                                      className="text-gray-700 dark:text-gray-900"
                                    />
                                  </span>
                                )}

                                <span
                                  className="
                                    pointer-events-none absolute inset-0
                                    rounded-full opacity-0
                                    ring-2 ring-black/10
                                    transition-opacity
                                    group-hover:opacity-100
                                    dark:ring-white/20
                                  "
                                />
                              </button>
                            );
                          })}
                        </div>

                        {/* SELECTED COLOR */}
                        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-[#45474a]">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm dark:border-white/10"
                            style={{
                              backgroundColor: note.color || "#ffffff",
                            }}
                          />

                          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            Current color
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PIN */}

                  <button
                    onClick={() => {
                      togglePin(note._id);
                      setOpenMenuId(null);
                    }}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-100

                      dark:text-gray-200
                      dark:hover:bg-[#3c4043]
                    "
                  >
                    <Pin size={17} />

                    {note.isPinned ? "Unpin note" : "Pin note"}
                  </button>

                  {/* REMINDER */}

                  <button
                    onClick={() => {
                      handleReminder(note);
                      setOpenMenuId(null);
                    }}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-100

                      dark:text-gray-200
                      dark:hover:bg-[#3c4043]
                    "
                  >
                    <Bell size={17} />
                    Set Reminder
                  </button>

                  <button
                    onClick={() => {
                      shareNote(note);
                      setOpenMenuId(null);
                    }}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-100

                      dark:text-gray-200
                      dark:hover:bg-[#3c4043]
                    "
                  >
                    <Share2 size={17} />
                    Share
                  </button>

                  <button
                    onClick={() => {
                      setVersionHistoryNoteId(note._id);
                      setOpenMenuId(null);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <History size={17} />
                    Version History
                  </button>

                  {/* ARCHIVE */}

                  <button
                    onClick={() => {
                      archiveNote(note._id);
                      setOpenMenuId(null);
                    }}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-100

                      dark:text-gray-200
                      dark:hover:bg-[#3c4043]
                    "
                  >
                    <Archive size={17} />
                    Archive
                  </button>

                  <div className="my-1 border-t border-gray-100 dark:border-[#3c4043]" />

                  {/* MOVE TO TRASH */}

                  <button
                    onClick={() => {
                      setDeleteId(note._id);
                      setOpenMenuId(null);
                    }}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left text-sm
                      text-red-500
                      transition
                      hover:bg-red-50

                      dark:hover:bg-red-500/10
                    "
                  >
                    <Trash2 size={17} />
                    Move to Trash
                  </button>
                </div>
              )}

              {/* ================= NOTE CONTENT ================= */}

              <div className="pr-8">
                <h2
                  className="
                    wrap-break-words
                    text-lg
                    font-semibold
                    leading-6
                    text-gray-900

                    dark:text-white
                  "
                >
                  {note.title || "Untitled"}
                </h2>

                <p
                  className="
                    mt-3 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-gray-600 dark:text-gray-300"
                >
                  {note.content}
                </p>
              </div>

              {note.labels && note.labels.length > 0 && (
                <div>
                  {note.labels.map((label) => (
                    <span
                      key={label._id}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-[#303134] dark:text-gray-300"
                    >
                      #{label.name}
                    </span>
                  ))}
                </div>
              )}

              {/* ================= TRASH ACTIONS ================= */}

              {isTrash && (
                <div className="mt-auto flex gap-3 pt-6">
                  <button
                    onClick={() => restoreNote(note._id)}
                    className="
                      flex flex-1 items-center justify-center gap-2
                      rounded-xl
                      bg-gray-100
                      px-3 py-2.5
                      text-sm font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-200

                      dark:bg-[#3c4043]
                      dark:text-gray-200
                      dark:hover:bg-[#4a4d50]
                    "
                  >
                    <RotateCcw size={16} />
                    Restore
                  </button>

                  <button
                    onClick={() => setPermanentDeletedId(note._id)}
                    className="
                      flex flex-1 items-center justify-center gap-2
                      rounded-xl
                      bg-red-500
                      px-3 py-2.5
                      text-sm font-medium
                      text-white
                      transition
                      hover:bg-red-600
                    "
                  >
                    <Trash size={16} />
                    Delete
                  </button>
                </div>
              )}

              {/* ================= ARCHIVE ACTION ================= */}

              {isArchive && (
                <div className="mt-auto pt-6">
                  <button
                    onClick={() => unarchiveNote(note._id)}
                    className="
                      flex w-full items-center justify-center gap-2
                      rounded-xl
                      bg-gray-100
                      px-4 py-2.5
                      text-sm font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-200

                      dark:bg-[#3c4043]
                      dark:text-gray-200
                      dark:hover:bg-[#4a4d50]
                    "
                  >
                    <RotateCcw size={17} />
                    Unarchive
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= MOVE TO TRASH MODAL ================= */}

      {deleteId && !isTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="
            w-full max-w-md
            rounded-2xl
            bg-white
            p-6
            shadow-2xl

            dark:bg-[#303134]
          "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/20">
              <Trash2 className="text-red-500" size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Move note to Trash?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              This note will be moved to Trash. You can restore it later if
              needed.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="
                  rounded-xl
                  px-5 py-2.5
                  text-sm font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-100

                  dark:text-gray-300
                  dark:hover:bg-[#3c4043]
                "
              >
                Cancel
              </button>

              <button
                onClick={() => deleteNote(deleteId)}
                className="
                  rounded-xl
                  bg-red-500
                  px-5 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-red-600
                "
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE FOREVER MODAL ================= */}

      {permanentDeletedId && isTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="
            w-full max-w-md
            rounded-2xl
            bg-white
            p-6
            shadow-2xl

            dark:bg-[#303134]
          "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/20">
              <Trash2 className="text-red-500" size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Delete note forever?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              This note will be permanently deleted and cannot be recovered.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setPermanentDeletedId(null)}
                className="
                  rounded-xl
                  px-5 py-2.5
                  text-sm font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-100

                  dark:text-gray-300
                  dark:hover:bg-[#3c4043]
                "
              >
                Cancel
              </button>

              <button
                onClick={() => deleteForever(permanentDeletedId)}
                className="
                  rounded-xl
                  bg-red-500
                  px-5 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-red-600
                "
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
      {shareNoteData && (
        <ShareModal
          shareUrl={shareNoteData.shareUrl}
          note={shareNoteData.note}
          onClose={() => setShareNoteData(null)}
        />
      )}
      {versionHistoryNoteId && (
        <VersionHistoryModal
          noteId={versionHistoryNoteId}
          onClose={() => setVersionHistoryNoteId(null)}
          onRestored={(updatedNote) => {
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note._id === updatedNote._id ? updatedNote : note,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

export default NotesList;
