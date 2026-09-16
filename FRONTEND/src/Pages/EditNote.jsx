import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  FileText,
  Check,
  ListChecks,
} from "lucide-react";
import useAutoSave from "../Hooks/useAutoSave";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [availableLabels, setAvailableLabels] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [checklistInput, setChecklistInput] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load note");
        }

        setTitle(data.title || "");
        setContent(data.content || "");
        setSelectedLabels(data.labels || []);
        setChecklist(data.checklist || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

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

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/labels");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch labels");
        }

        setLabels(data);
      } catch (error) {
        console.error("Fetch Labels Error:", error);
      }
    };

    fetchLabels();
  }, []);

  const saveNote = useCallback(async (noteId, title, content) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
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

    if (!response.ok) {
      throw new Error("Failed to save note");
    }
    return response.json();
  }, []);

  const saveStatus = useAutoSave({
    noteId: id,
    title,
    content,
    saveNote,
  });

  const addChecklistItem = () => {
    const text = checklistInput.trim();

    if (!text) {
      return;
    }

    setChecklist((prev) => [
      ...prev,
      {
        text,
        completed: false,
      },
    ]);

    setChecklistInput("");
  };

  const removeChecklistItem = (index) => {
    setChecklist((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleChecklistItem = (index) => {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const handleChecklistKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChecklistItem();
    }
  };

  // ================= UPDATE NOTE =================

  const updateNote = async (e) => {
    e.preventDefault();

    if (!title.trim() && !content.trim() && checklist.length === 0) {
      setError("Please enter a title, note content, or checklist item");
      return;
    }

    try {
      setUpdating(true);
      setError("");

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
          labels: selectedLabels,
          checklist,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      navigate("/");
    } catch (error) {
      console.error("Update Error:", error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={34} className="animate-spin text-[#e60023]" />

          <p className="text-gray-500 dark:text-gray-400">
            Loading your note...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] dark:bg-[#111111] px-4 py-6 md:px-8 md:py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#242424] text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-[#303030] transition-all"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          {/* Save Button */}
          <button
            type="submit"
            form="edit-note-form"
            disabled={updating}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 hover:bg-[#c98300] text-white font-semibold shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save
              </>
            )}
          </button>
        </div>

        {/* MAIN PINTEREST CARD */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] bg-white dark:bg-[#1e1e1e] rounded-4xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/30 transition-colors">
          {/* LEFT SIDE */}
          <div className="relative bg-yellow-400 min-h-50 md:min-h-full flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-12 -left-12" />

            <div className="absolute w-52 h-52 rounded-full bg-black/5 -bottom-20 -right-20" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-cente mx-auto mb-5 shadow-lg">
                <FileText size={36} className="text-red-400" />
              </div>

              <h1 className="text-2xl font-bold text-white">Edit your Pin</h1>

              <p className="text-white/75 text-sm mt-3 leading-relaxed">
                Make your ideas look beautiful and keep everything updated.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE EDITOR */}
          <form
            id="edit-note-form"
            onSubmit={updateNote}
            className="p-6 md:p-10"
          >
            {/* ERROR */}
            {error && (
              <div className="flex items-center justify-between mb-6 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                <span>{error}</span>

                <button type="button" onClick={() => setError("")}>
                  <X size={18} />
                </button>
              </div>
            )}

            {/* SMALL LABEL */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#e60023]" />

              <span className="text-xs font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500">
                EDIT NOTE
              </span>
            </div>

            {/* TITLE */}
            <input
              type="text"
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full  text-3xl md:text-4xl font-bold bg-transparent text-[#111111] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none border-none pb-5"
            />

            <div className="w-12 h-1 bg-[#e60023] rounded-full mb-7" />

            <div className="mt-5">
              <p className="mb-2 text-sm front-medium text-gray-700 dark:text-gray-300">
                Labels
              </p>
            </div>

            <div>
              {labels.map((label) => {
                const isSelected = selectedLabels.includes(label._id);

                return (
                  <button
                    key={label._id}
                    type="button"
                    onClick={() => {
                      setSelectedLabels((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== label._id)
                          : [...prev, label._id],
                      );
                    }}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      isSelected
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-100 text-gray-700 dark:bg-[#303134] dark:text-gray-300"
                    }`}
                  >
                    #{label.name}
                  </button>
                );
              })}
            </div>

            {labels.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No labels created yet.
              </p>
            )}
            {/* CHECKLIST */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks size={19} className="text-yellow-500" />

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Checklist
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#292929] p-4 border border-transparent focus-within:border-yellow-400 transition-all">
                {/* CHECKLIST ITEMS */}
                <div className="space-y-2">
                  {checklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(index)}
                        className="h-5 w-5 cursor-pointer accent-yellow-400"
                      />

                      <span
                        className={`flex-1 text-[15px] ${
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {item.text}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeChecklistItem(index)}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-[#3c4043] dark:hover:text-white"
                        title="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* ADD NEW ITEM */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl text-gray-400">+</span>

                  <input
                    type="text"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={handleChecklistKeyDown}
                    placeholder="Add checklist item..."
                    className="flex-1 bg-transparent py-2 text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
                  />

                  <button
                    type="button"
                    onClick={addChecklistItem}
                    className="rounded-full px-3 py-1.5 text-sm font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <textarea
              placeholder="Tell everyone about your idea..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-80 bg-[#f7f7f7] dark:bg-[#292929] rounded-2xl px-5 py-5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 leading-relaxed outline-none resize-none border border-transparent focus:border-[#e60023] transition-all"
            />

            {/* FOOTER */}
            <div
              className="flex flex-col
                sm:flex-row items-start sm:items-center justify-between gap-4 mt-6"
            >
              {/* Character count */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#292929] flex items-center justify-center">
                  <FileText size={15} className="text-gray-400" />
                </div>

                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {content.length} characters
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === "Saving" && (
                  <>
                    <Loader2
                      size={16}
                      className="text-yellow-500 font-medium"
                    />
                    <span className="text-yellow-500 font-medium">
                      Saving...
                    </span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-500 font-medium">Saved</span>
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <X size={16} className="text-red-500 font-medium" />
                    <span className="text-green-500 font-medium">
                      Save Failed
                    </span>
                  </>
                )}
              </div>
            </div>
            {/* MOBILE SAVE BUTTON */}
            <button
              type="submit"
              disabled={updating}
              className="md:hidden w-full flex items-center justify-center gap-2 mt-7 py-3 rounded-full bg-[#e60023] text-white font-semibold"
            >
              {updating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* CANCEL */}
        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={updating}
          className="flex items-center gap-2 mx-auto mt-6 px-5 py-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#242424] hover:text-[#e60023] transition"
        >
          <X size={18} />
          Cancel editing
        </button>
      </div>
    </div>
  );
}

export default EditNote;
