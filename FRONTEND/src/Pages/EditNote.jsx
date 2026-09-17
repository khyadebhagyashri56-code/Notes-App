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
  Tag,
  Plus,
  Sparkles,
} from "lucide-react";
import useAutoSave from "../Hooks/useAutoSave";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

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
        setSelectedLabels(
          (data.labels || []).map((label) =>
            typeof label === "object" ? label._id : label,
          ),
        );
        setChecklist(data.checklist || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id]);

  useEffect(() => {
    const markAsViewed = async () => {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/notes/${id}/view`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to update viewed time:", error);
      }
    };

    if (id) markAsViewed();
  }, [id]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/labels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch labels");
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
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) throw new Error("Failed to save note");
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
    if (!text) return;

    setChecklist((prev) => [...prev, { text, completed: false }]);
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
      if (!response.ok)
        throw new Error(data.message || "Failed to update note");

      navigate("/");
    } catch (error) {
      console.error("Update Error:", error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] dark:bg-[#0f1115] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#191c22] shadow-sm flex items-center justify-center">
            <Loader2 size={25} className="animate-spin text-[#e60023]" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your note...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] dark:bg-[#0f1115] text-[#171717] dark:text-white transition-colors duration-300">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 dark:border-white/10 bg-[#f7f7f5]/90 dark:bg-[#0f1115]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
          >
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#191c22] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:-translate-x-0.5 transition-transform">
              <ArrowLeft size={19} />
            </span>
            <span className="hidden sm:inline">Back to notes</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gray-400 dark:text-gray-500">
            <span>NOTES</span>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200">EDIT NOTE</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {saveStatus === "Saving" && (
                <>
                  <Loader2 size={14} className="animate-spin text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Saving...
                  </span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Check size={14} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Saved
                  </span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <X size={14} className="text-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Save failed
                  </span>
                </>
              )}
            </div>

            <button
              type="submit"
              form="edit-note-form"
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e60023] hover:bg-[#c90020] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {updating ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {updating ? "Saving" : "Save changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 lg:py-10">
        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          {/* LEFT - NOTE PREVIEW */}
          <aside className="lg:sticky lg:top-24.5 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-2">
                <Sparkles size={14} />
                EDITOR PREVIEW
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Make it yours.
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-6">
                Update your note, organize it with labels, and keep your
                checklist in one place.
              </p>
            </div>

            <div className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#191c22] shadow-sm overflow-hidden">
              <div className="h-2 bg-[#e60023]" />
              <div className="p-6">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-[#242832] flex items-center justify-center mb-5">
                  <FileText size={20} className="text-[#e60023]" />
                </div>

                <h2 className="text-xl font-bold leading-7 wrap-break-words">
                  {title.trim() || "Untitled note"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400 whitespace-pre-wrap wrap-break-words line-clamp-8">
                  {content.trim() || "Your note content will appear here..."}
                </p>

                {selectedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {labels
                      .filter((label) => selectedLabels.includes(label._id))
                      .map((label) => (
                        <span
                          key={label._id}
                          className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#242832] text-xs font-medium text-gray-600 dark:text-gray-300"
                        >
                          #{label.name}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{content.length} characters</span>
                  <span>
                    {checklist.length} checklist{" "}
                    {checklist.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT - EDITOR */}
          <form
            id="edit-note-form"
            onSubmit={updateNote}
            className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#191c22] shadow-sm overflow-hidden"
          >
            <div className="px-5 sm:px-7 lg:px-9 pt-7 pb-5 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#e60023]">
                    NOTE DETAILS
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Changes are automatically saved.
                  </p>
                </div>
                <div className="sm:hidden flex items-center gap-1.5 text-xs">
                  {saveStatus === "Saving" && (
                    <Loader2
                      size={14}
                      className="animate-spin text-amber-500"
                    />
                  )}
                  {saveStatus === "saved" && (
                    <Check size={14} className="text-green-500" />
                  )}
                  <span className="text-gray-400 dark:text-gray-500">
                    {saveStatus === "Saving"
                      ? "Saving"
                      : saveStatus === "saved"
                        ? "Saved"
                        : ""}
                  </span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Give your note a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent outline-none border-0 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>

            {/* LABELS */}
            <section className="px-5 sm:px-7 lg:px-9 py-6 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={17} className="text-gray-400" />
                <h3 className="text-sm font-semibold">Labels</h3>
              </div>

              {labels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => {
                    const isSelected = selectedLabels.includes(label._id);
                    return (
                      <button
                        key={label._id}
                        type="button"
                        onClick={() => {
                          setSelectedLabels((prev) =>
                            isSelected
                              ? prev.filter((labelId) => labelId !== label._id)
                              : [...prev, label._id],
                          );
                        }}
                        className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                          isSelected
                            ? "bg-[#e60023] border-[#e60023] text-white shadow-sm"
                            : "bg-gray-50 dark:bg-[#22262e] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        #{label.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No labels created yet.
                </p>
              )}
            </section>

            {/* CONTENT */}
            <section className="px-5 sm:px-7 lg:px-9 py-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Content</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {content.length} characters
                </span>
              </div>

              <textarea
                placeholder="Start writing your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-90 bg-[#fafafa] dark:bg-[#11141a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-5 text-[16px] leading-7 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none resize-y focus:border-gray-400 dark:focus:border-white/25 transition"
              />
            </section>

            {/* CHECKLIST */}
            <section className="px-5 sm:px-7 lg:px-9 pb-7">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListChecks size={18} className="text-gray-400" />
                  <h3 className="text-sm font-semibold">Checklist</h3>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {checklist.filter((item) => item.completed).length}/
                  {checklist.length} done
                </span>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-[#fafafa] dark:bg-[#11141a] overflow-hidden">
                {checklist.length > 0 && (
                  <div className="p-2 border-b border-gray-200 dark:border-white/10">
                    {checklist.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/3 dark:hover:bg-white/3"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(index)}
                          className="w-4.5 h-4.5 accent-[#e60023] cursor-pointer"
                        />
                        <span
                          className={`flex-1 text-sm ${item.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"}`}
                        >
                          {item.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeChecklistItem(index)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                          title="Remove item"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 px-4 py-3">
                  <Plus size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={handleChecklistKeyDown}
                    placeholder="Add a checklist item..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    className="px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold hover:opacity-85 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            {/* FOOTER ACTIONS */}
            <div className="px-5 sm:px-7 lg:px-9 py-5 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={updating}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22262e] transition disabled:opacity-50"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#e60023] hover:bg-[#c90020] text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {updating ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Check size={17} />
                )}
                {updating ? "Saving..." : "Save note"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditNote;
