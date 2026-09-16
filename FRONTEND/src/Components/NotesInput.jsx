import React, { useEffect, useState } from "react";
import { SendHorizontal, Palette, X, Check, ListChecks } from "lucide-react";

function NotesInput({ notes, setNotes, edit, setEdit, setToast, darkMode }) {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [showColors, setShowColors] = useState(false);
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [checklistInput, setChecklistInput] = useState("");

  const colors = [
    "#ffffff",
    "#f28b82",
    "#fbbc04",
    "#fff475",
    "#ccff90",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#fdcfe8",
  ];
  // LOAD EDIT NOTE

  useEffect(() => {
    if (edit) {
      setTitle(edit.title || "");
      setContent(edit.content || "");
      setColor(edit.color || "#ffffff");
      setChecklist(edit.checklist || []);
      setIsChecklist((edit.checklist || []).length > 0);
      setExpanded(true);
    }
  }, [edit]);

  // RESET FORM

  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor("#ffffff");
    setChecklist([]);
    setChecklistInput("");
    setIsChecklist(false);
    setShowColors(false);
    setExpanded(false);
    setEdit(null);
  };

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

  // ADD / UPDATE NOTE
  const addNote = async () => {
    if (!title.trim() && !content.trim() && checklist.length === 0) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // UPDATE NOTE
      if (edit) {
        const response = await fetch(
          `http://localhost:5000/api/notes/${edit._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              title,
              content,
              color,
              checklist,
            }),
          },
        );

        const updatedNote = await response.json();

        if (!response.ok) {
          setToast({
            message: updatedNote.message || "Failed to update note",
            type: "error",
          });

          return;
        }

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === updatedNote._id ? updatedNote : note,
          ),
        );

        setToast({
          message: "Note updated successfully!",
          type: "success",
        });

        resetForm();

        return;
      }
      // CREATE NOTE
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
          content,
          color,
          checklist,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || "Failed to create note",
          type: "error",
        });

        return;
      }

      setNotes((prev) => [data, ...prev]);

      setToast({
        message: "Note created successfully!",
        type: "success",
      });

      resetForm();
    } catch (error) {
      console.log("Note Error:", error);

      setToast({
        message: "Something went wrong",
        type: "error",
      });
    }
  };

  // KEYBOARD

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowColors(false);
    }

    if (e.ctrlKey && e.key === "Enter") {
      addNote();
    }
  };
  // BACKGROUND STYLE
  const inputStyle = {
    backgroundColor:
      color !== "#ffffff" ? color : darkMode ? "#2d2e30" : "#ffffff",
  };

  // UI
  return (
    <div className="flex w-full justify-center cursor-pointer">
      <div
        className="relative w-full max-w-3xl overflow-visible rounded-2xl border border-gray-200 shadow-[0_6px_25px_rgba(0,0,0,0.10)] transition-all duration-300 dark:border-[#3c4043] dark:shadow-[0_6px_25px_rgba(0,0,0,0.40)]"
        style={inputStyle}
      >
            {/* HEADER */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Take a note..."
            value={title}
            onFocus={() => setExpanded(true)}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent px-6 pt-5 ${expanded ? "pb-2" : "pb-5"} text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500`}
          />

          {expanded && (
            <button
              type="button"
              onClick={resetForm}
              className=" mr-4 mt-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-[#3c4043] dark:hover:text-white"
              title="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {/* CONTENT */}
        {expanded && (
          <>
            {isChecklist ? (
              <div className="px-6 py-3">
                {/* CHECKLIST ITEMS */}
                <div className="space-y-2">
                  {checklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(index)}
                        className="h-5 w-5 cursor-pointer"
                      />

                      <span
                        className={`
                  flex-1
                  text-[15px]
                  ${
                    item.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-700 dark:text-gray-200"
                  }
                `}
                      >
                        {item.text}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeChecklistItem(index)}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-70 dark:hover:bg-[#3c4043] dark:hover:text-white"
                        title="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* ADD ITEM */}

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl text-gray-400">+</span>

                  <input
                    type="text"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={handleChecklistKeyDown}
                    placeholder="List item..."
                    className="flex-1 bg-transparent py-2 text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            ) : (
              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus={!!edit}
                className="w-full min-h-35 resize-none bg-transparent px-6 py-3 text-[15px] leading-7 text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
              />
            )}
          </>
        )}

        {/* TOOLBAR */}

        {expanded && (
          <div className="relative flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-[#3c4043]">
            {/* LEFT SIDE BUTTONS */}

            <div className="flex items-center gap-1">
              {/* CHECKLIST BUTTON */}

              <button
                type="button"
                onClick={() => setIsChecklist(!isChecklist)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3c4043]"
              >
                <ListChecks size={19} />

                <span className="hidden sm:block">Checklist</span>
              </button>

              {/* COLOR BUTTON */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColors(!showColors)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3c4043]"
                >
                  <Palette size={19} />

                  <span className="hidden sm:block">Color</span>
                </button>

                {/* COLOR PICKER */}

                {showColors && (
                  <div className="absolute bottom-14 left-0 z-100 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-[#3c4043] dark:bg-[#303134]">
                    <p className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Choose note color
                    </p>

                    <div className="grid grid-cols-5 gap-3">
                      {colors.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => {
                            setColor(item);
                            setShowColors(false);
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 shadow-sm transition-all duration-200"
                          style={{
                            backgroundColor: item,
                          }}
                          title="Select color"
                        >
                          {color === item && (
                            <Check size={17} className="text-gray-800" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CREATE BUTTON */}

            <button
              type="button"
              onClick={addNote}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            >
              <span>{edit ? "Update Note" : "Create Note"}</span>

              <SendHorizontal size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesInput;
