import React, { useEffect, useState } from "react";
import { History, RotateCcw, X, Clock3 } from "lucide-react";

function VersionHistoryModal({ noteId, onClose, onRestored }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  // Fetch Version History
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/notes/${noteId}/versions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load version history");
        }

        setVersions(data);
      } catch (error) {
        console.error("Version History Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (noteId) {
      fetchVersions();
    }
  }, [noteId]);

  // Restore Version
  const restoreVersion = async (versionId) => {
    try {
      setRestoringId(versionId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}/versions/${versionId}/restore`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to restore version");
      }

      // Updated note parent component ko bhejo
      if (onRestored) {
        onRestored(data.note);
      }

      onClose();
    } catch (error) {
      console.error("Restore Version Error:", error);
      setError(error.message);
    } finally {
      setRestoringId(null);
    }
  };

  // Newest version first
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#202124]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <History size={21} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Version History
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and restore previous versions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto p-6">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Loading version history...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && sortedVersions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History size={42} className="text-gray-300 dark:text-gray-600" />

              <h3 className="mt-4 text-base font-medium text-gray-700 dark:text-gray-200">
                No previous versions
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Previous versions will appear here when you edit and save this
                note.
              </p>
            </div>
          )}

          {/* Versions */}
          {!loading && !error && sortedVersions.length > 0 && (
            <div className="space-y-4">
              {sortedVersions.map((version, index) => (
                <div
                  key={version._id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 dark:border-gray-700 dark:bg-[#292a2d] dark:hover:border-gray-600"
                >
                  {/* Version Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          Version {sortedVersions.length - index}
                        </span>

                        {index === 0 && (
                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 truncate text-base font-semibold text-gray-900 dark:text-white">
                        {version.title || "Untitled Note"}
                      </h3>

                      {/* Date */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock3 size={14} />

                        {new Date(version.savedAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Restore */}
                    <button
                      onClick={() => restoreVersion(version._id)}
                      disabled={restoringId === version._id}
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                      <RotateCcw size={15} />

                      {restoringId === version._id ? "Restoring..." : "Restore"}
                    </button>
                  </div>

                  {/* Content Preview */}
                  {version.content && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-[#202124]">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600 line-clamp-4 dark:text-gray-300">
                        {version.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-3 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Your current note is automatically saved before restoring an older
            version.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VersionHistoryModal;
