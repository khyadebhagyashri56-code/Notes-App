import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Loader2, AlertCircle } from "lucide-react";

function SharedNote({ darkMode }) {
  const { shareId } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/notes/shared/${shareId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Shared note not found");
        }

        setNote(data);
      } catch (error) {
        console.log("Shared Note Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#202124]" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
          <Loader2 className="animate-spin" size={22} />
          <span>Loading shared note...</span>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          darkMode ? "bg-[#202124]" : "bg-gray-50"
        }`}
      >
        <div
          className="
            w-full max-w-md
            rounded-3xl
            border
            border-gray-200
            bg-white
            p-8
            text-center
            shadow-lg
            dark:border-[#3c4043]
            dark:bg-[#303134]
          "
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-[#3c4043]">
            <AlertCircle
              size={26}
              className="text-gray-600 dark:text-gray-300"
            />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Note Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This shared note may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-10 ${
        darkMode ? "bg-[#202124]" : "bg-gray-50"
      }`}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}

        <div className="mb-6 flex items-center gap-3">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-2xl
              bg-white
              shadow-sm
              dark:bg-[#303134]
            "
          >
            <FileText size={21} className="text-gray-700 dark:text-gray-200" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Shared Note
            </p>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              Read-only
            </p>
          </div>
        </div>

        {/* Note */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            shadow-sm
            dark:border-[#3c4043]
          "
          style={{
            backgroundColor: note.color || "#ffffff",
          }}
        >
          <div className="p-7 sm:p-9">
            <h1 className="text-3xl font-semibold leading-tight text-gray-900">
              {note.title || "Untitled Note"}
            </h1>

            <div
              className="
                mt-6
                whitespace-pre-wrap
                text-base
                leading-7
                text-gray-700
              "
            >
              {note.content || "No content"}
            </div>

            {/* Labels */}

            {note.labels && note.labels.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {note.labels.map((label) => (
                  <span
                    key={label._id || label}
                    className="
                      rounded-full
                      bg-black/5
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    {label.name || label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}

        <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
          This note was shared using Notes App.
        </p>
      </div>
    </div>
  );
}

export default SharedNote;
