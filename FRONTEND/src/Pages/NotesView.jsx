import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Pin,
  Star,
  Check,
  X,
  Clock3,
  Archive,
  Trash2,
  Pencil,
  Share2,
  Palette,
  Tag,
  Bell,
} from "lucide-react";

function NoteView({ darkMode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setNote(data);
          setTitle(data.title || "");
          setContent(data.content || "");
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  // Mark note as viewed
  useEffect(() => {
    const markAsViewed = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:5000/api/notes/${id}/view`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to update viewed time:", error);
      }
    };

    if (id) {
      markAsViewed();
    }
  }, [id]);

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNote(data);
        setIsEditing(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancel = () => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setIsEditing(false);
  };

  const changeNoteColor = async (color) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          color,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNote(data);
        setShowColorPicker(false);
        setMenuOpen(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error changing note color:", error);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#111827]" : "bg-[#f8fafc]"
        }`}
      >
        <div className="text-gray-500">Loading note...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#111827] text-white" : "bg-[#f8fafc]"
        }`}
      >
        Note not found
      </div>
    );
  }

  const cardBg = darkMode ? "bg-[#1f2937]" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const secondaryText = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`min-h-screen px-4 py-6 md:px-8 ${
        darkMode ? "bg-[#111827]" : "bg-[#f8fafc]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`p-2.5 rounded-xl transition ${
              darkMode
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <ArrowLeft size={21} />
          </button>

          <div className="flex items-center gap-2 relative">
            {/* PIN */}
            {note.isPinned && (
              <div
                className={`p-2.5 rounded-xl ${
                  darkMode
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-yellow-50 text-yellow-600"
                }`}
                title="Pinned"
              >
                <Pin size={19} fill="currentColor" />
              </div>
            )}

            {/* FAVORITE */}
            <button
              className={`p-2.5 rounded-xl transition ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-200 text-gray-500"
              }`}
            >
              <Star size={20} />
            </button>

            {/* THREE DOTS */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2.5 rounded-xl transition ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <MoreVertical size={21} />
            </button>

            {/* MENU */}
            {menuOpen && (
              <div
                className={`absolute right-0 top-12 w-52 rounded-2xl shadow-xl border p-2 z-50 ${
                  darkMode
                    ? "bg-[#1f2937] border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Pencil size={17} />
                  Edit Note
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Share2 size={17} />
                  Share
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Palette size={17} />
                    Change Color
                  </button>

                  {showColorPicker && (
                    <div
                      className={`mt-2 p-3 rounded-xl border grid grid-cols-5 gap-2 ${
                        darkMode
                          ? "bg-[#111827] border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {[
                        "#ffffff",
                        "#fef3c7",
                        "#fee2e2",
                        "#dcfce7",
                        "#dbeafe",
                        "#f3e8ff",
                        "#fce7f3",
                        "#e0f2fe",
                        "#f3f4f6",
                        "#ffedd5",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => changeNoteColor(color)}
                          className={`w-7 h-7 rounded-full border ${
                            note.color === color
                              ? "ring-2 ring-blue-500 ring-offset-1"
                              : ""
                          }`}
                          style={{ backgroundColor: color }}
                          title="Change color"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Tag size={17} />
                  Labels
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Bell size={17} />
                  Set Reminder
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Archive size={17} />
                  Archive
                </button>

                <div
                  className={`my-1 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                />

                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? "hover:bg-red-500/10 text-red-400"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  <Trash2 size={17} />
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NOTE CARD */}
        <div
          style={{
            backgroundColor:
              note.color && note.color !== "#ffffff" ? note.color : undefined,
          }}
          className={`${cardBg} rounded-3xl border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } shadow-sm overflow-hidden`}
        >
          {/* NOTE CONTENT */}
          <div className="px-6 py-7 md:px-10 md:py-9">
            {isEditing ? (
              <>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className={`w-full text-3xl md:text-4xl font-bold bg-transparent outline-none mb-6 ${
                    darkMode
                      ? "text-white placeholder-gray-600"
                      : "text-gray-900 placeholder-gray-300"
                  }`}
                />

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note..."
                  rows={12}
                  className={`w-full resize-none bg-transparent outline-none leading-7 text-[16px] ${
                    darkMode
                      ? "text-gray-300 placeholder-gray-600"
                      : "text-gray-700 placeholder-gray-400"
                  }`}
                />
              </>
            ) : (
              <>
                {/* TITLE */}
                <h1
                  className={`text-3xl md:text-4xl font-bold tracking-tight mb-7 ${textColor}`}
                >
                  {note.title || "Untitled Note"}
                </h1>

                {/* CONTENT */}
                <div
                  className={`whitespace-pre-wrap leading-8 text-[16px] md:text-[17px] ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {note.content || "No content in this note."}
                </div>
              </>
            )}

            {/* LABELS */}
            {note.labels && note.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {note.labels.map((label) => (
                  <span
                    key={label._id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-blue-500/10 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Tag size={13} />
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            {/* CHECKLIST */}
            {note.checklist && note.checklist.length > 0 && (
              <div
                className={`mt-8 p-4 rounded-2xl ${
                  darkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-medium text-sm ${textColor}`}>
                    Checklist
                  </span>

                  <span className={`text-xs ${secondaryText}`}>
                    {note.checklist.filter((item) => item.completed).length} /{" "}
                    {note.checklist.length} completed
                  </span>
                </div>

                <div className="space-y-2">
                  {note.checklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          item.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : darkMode
                              ? "border-gray-600"
                              : "border-gray-300"
                        }`}
                      >
                        {item.completed && <Check size={13} />}
                      </div>

                      <span
                        className={`${
                          item.completed ? "line-through opacity-50" : textColor
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* METADATA */}
          <div
            className={`border-t px-6 py-5 md:px-10 ${
              darkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p
                  className={`text-xs uppercase tracking-wider font-medium mb-1 ${secondaryText}`}
                >
                  Created
                </p>

                <p className={`text-sm ${textColor}`}>
                  {formatDateTime(note.createdAt)}
                </p>
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-wider font-medium mb-1 ${secondaryText}`}
                >
                  Updated
                </p>

                <p className={`text-sm ${textColor}`}>
                  {formatDateTime(note.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* EDIT BUTTONS */}
          {isEditing && (
            <div
              className={`border-t px-6 py-4 md:px-10 flex justify-end gap-3 ${
                darkMode ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <button
                onClick={handleCancel}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
              >
                <Check size={16} />
                OK
              </button>
            </div>
          )}
        </div>

        {/* LAST VIEWED */}
        {note.lastViewedAt && (
          <div
            className={`flex items-center justify-center gap-2 mt-5 text-xs ${secondaryText}`}
          >
            <Clock3 size={14} />
            Last viewed {formatDateTime(note.lastViewedAt)}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteView;
