import React, { useState, useEffect } from "react";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Clock3,
  ArrowUp,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import NotesInput from "../Components/NotesInput";
import NotesList from "../Components/NotesList";
import Labels from "./Labels";

function HomePage({ active, search, setToast, darkMode }) {
  const [notes, setNotes] = useState([]);
  const [edit, setEdit] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [showSort, setShowSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    pinned: false,
    favorite: false,
    reminder: false,
    archived: false,
    label: "",
    color: "",
    date: "",
  });

  const activeFilterCount = Object.values(filters).filter((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    return value !== "";
  }).length;

  const filteredNotes = notes.filter((note) => {
    // SEARCH
    if (search && search.trim() !== "") {
      const searchText = search.toLowerCase();

      const matchesSearch =
        note.title?.toLowerCase().includes(searchText) ||
        note.content?.toLowerCase().includes(searchText);

      if (!matchesSearch) {
        return false;
      }
    }

    // PINNED
    if (filters.pinned && !note.isPinned) {
      return false;
    }

    // FAVORITE
    if (filters.favorite && !note.isFavorite) {
      return false;
    }

    // REMINDER
    if (filters.reminder && !note.reminderAt) {
      return false;
    }

    // ARCHIVED
    if (filters.archived && !note.isArchived) {
      return false;
    }

    // LABEL
    if (filters.label) {
      if (!note.labels?.some((label) => label.name === filters.label)) {
        return false;
      }
    }

    // COLOR
    if (filters.color && note.color !== filters.color) {
      return false;
    }

    // DATE
    if (filters.date) {
      const noteDate = new Date(note.createdAt);
      const now = new Date();

      if (filters.date === "today") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        if (noteDate < startOfToday) {
          return false;
        }
      }

      if (filters.date === "7days") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        if (noteDate < sevenDaysAgo) {
          return false;
        }
      }

      if (filters.date === "30days") {
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
        );

        if (noteDate < thirtyDaysAgo) {
          return false;
        }
      }
    }

    return true;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Pinned notes hamesha upar rahengi
    if (a.isPinned !== b.isPinned) {
      return Number(b.isPinned) - Number(a.isPinned);
    }

    // Latest notes
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    // Oldest notes
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    // Title A-Z
    if (sortBy === "az") {
      return (a.title || "").localeCompare(b.title || "");
    }

    // Title Z-A
    if (sortBy === "za") {
      return (b.title || "").localeCompare(a.title || "");
    }

    return 0;
  });

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setNotes(data);
    } catch (error) {
      console.log("Fetch Notes Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/notes/trash", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setNotes(data);
    } catch (error) {
      console.log("Trash Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH ARCHIVE NOTES

  const fetchArchiveNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/archive", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Archive Fetch Error:", data.message);
        return;
      }

      setNotes(data);
    } catch (error) {
      console.log("Archive Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active === "Notes") {
      fetchNotes();
    }

    if (active === "Trash") {
      fetchTrashNotes();
    }

    if (active === "Archive") {
      fetchArchiveNotes();
    }
  }, [active]);

  return (
    <main
      className="
        flex-1
        min-h-screen
        w-full
        bg-[#FFFAF3]
        text-gray-900
        transition-colors
        duration-300

        dark:bg-[#202124]
        dark:text-white
      "
    >
      {active === "Notes" && (
        <section className="w-full">
          <div className="w-full bg-white px-3 sm:px-6 lg:px-8 py-6 sm:py-8 border-b border-gray-200 dark:bg-[#202124] dark:border-[#3c4043]">
            <div className="flex items-start gap-4">
              {/* TAKE A NOTE */}
              <div className="flex-1">
                <NotesInput
                  notes={notes}
                  setNotes={setNotes}
                  edit={edit}
                  setEdit={setEdit}
                  setToast={setToast}
                  darkMode={darkMode}
                />
              </div>

              {/* FILTER BUTTON */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:border-yellow-300 hover:shadow-md dark:border-[#3c4043] dark:bg-[#303134] dark:text-gray-100 dark:hover:border-yellow-300 dark:hover:bg-[#3c4043]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 dark:bg-yellow-300 dark:text-gray-900">
                    <ArrowDownUp size={18} />
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      Filters
                    </p>

                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Advanced Search</p>

                      {activeFilterCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1.5 text-xs font-bold text-gray-900">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50 dark:border-[#3c4043] dark:bg-[#303134]">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Filter Notes
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Apply one or more filters
                      </p>
                    </div>

                    {/* PINNED */}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                      <input
                        type="checkbox"
                        checked={filters.pinned}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            pinned: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-yellow-500"
                      />

                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Pinned
                      </span>
                    </label>

                    {/* FAVORITE */}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                      <input
                        type="checkbox"
                        checked={filters.favorite}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            favorite: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-yellow-500"
                      />

                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Favorite
                      </span>
                    </label>

                    {/* REMINDER */}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                      <input
                        type="checkbox"
                        checked={filters.reminder}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            reminder: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-yellow-500"
                      />

                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Has Reminder
                      </span>
                    </label>

                    {/* ARCHIVED */}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                      <input
                        type="checkbox"
                        checked={filters.archived}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            archived: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-yellow-500"
                      />

                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Archived
                      </span>
                    </label>
                    {/* LABEL FILTER */}
                    <div className="mt-3 border-t border-gray-200 pt-3 dark:border-[#3c4043]">
                      <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Label
                      </label>

                      <select
                        value={filters.label}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            label: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-yellow-400 dark:border-[#3c4043] dark:bg-[#202124] dark:text-gray-200"
                      >
                        <option value="">All Labels</option>

                        {[
                          ...new Set(
                            notes.flatMap((note) =>
                              (note.labels || []).map((label) =>
                                typeof label === "string" ? label : label.name,
                              ),
                            ),
                          ),
                        ].map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* COLOR FILTER */}
                    <div className="mt-3 border-t border-gray-200 pt-3 dark:border-[#3c4043]">
                      <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Note Color
                      </label>

                      <select
                        value={filters.color}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            color: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-yellow-400 dark:border-[#3c4043] dark:bg-[#202124] dark:text-gray-200"
                      >
                        <option value="">All Colors</option>
                        <option value="#ffffff">White</option>
                        <option value="#f28b82">Red</option>
                        <option value="#fbbc04">Yellow</option>
                        <option value="#fff475">Light Yellow</option>
                        <option value="#ccff90">Green</option>
                        <option value="#a7ffeb">Teal</option>
                        <option value="#cbf0f8">Blue</option>
                        <option value="#aecbfa">Dark Blue</option>
                        <option value="#d7aefb">Purple</option>
                        <option value="#fdcfe8">Pink</option>
                      </select>
                    </div>
                    {/* DATE FILTER */}
                    <div className="mt-3 border-t border-gray-200 pt-3 dark:border-[#3c4043]">
                      <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Created Date
                      </label>

                      <select
                        value={filters.date}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            date: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-yellow-400 dark:border-[#3c4043] dark:bg-[#202124] dark:text-gray-200"
                      >
                        <option value="">Any Time</option>
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                )}
                {/* CLEAR ALL FILTERS */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() =>
                      setFilters({
                        pinned: false,
                        favorite: false,
                        reminder: false,
                        archived: false,
                        label: "",
                        color: "",
                        date: "",
                      })
                    }
                    className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-[#3c4043] dark:text-gray-200 dark:hover:bg-[#3c4043]"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              NOTES LIST AREA
          ========================= */}

          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="
            h-40
            animate-pulse
            rounded-2xl
            border
            border-gray-200
            bg-gray-100
            dark:border-[#3c4043]
            dark:bg-[#303134]
          "
                  />
                ))}
              </div>
            ) : search && search.trim() !== "" && sortedNotes.length === 0 ? (
              <div className="flex min-h-96 flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-[#303134]">
                  <span className="text-3xl">🔍</span>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  No notes found
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No notes match your search.
                </p>
              </div>
            ) : (
              <NotesList
                notes={sortedNotes}
                setEdit={setEdit}
                setNotes={setNotes}
                setToast={setToast}
                isTrash={false}
                isArchive={false}
              />
            )}
          </div>
        </section>
      )}

      {/* Trash Page */}

      {active === "Trash" && (
        <section className="w-full min-h-screen">
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="
            h-40
            animate-pulse
            rounded-2xl
            border
            border-gray-200
            bg-gray-100

            dark:border-[#3c4043]
            dark:bg-[#303134]
          "
                  />
                ))}
              </div>
            ) : (
              <NotesList
                notes={sortedNotes}
                setEdit={setEdit}
                setNotes={setNotes}
                setToast={setToast}
                isTrash={true}
                isArchive={false}
              />
            )}
          </div>
        </section>
      )}

      {/*ARCHIVE PAGE*/}

      {active === "Archive" && (
        <section className="w-full min-h-screen">
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-[#3c4043] dark:bg-[#303134]"
                  />
                ))}
              </div>
            ) : (
              <NotesList
                notes={sortedNotes}
                setEdit={setEdit}
                setNotes={setNotes}
                setToast={setToast}
                isTrash={false}
                isArchive={true}
              />
            )}
          </div>
        </section>
      )}

      {/* =========================
          LABELS PAGE
      ========================= */}

      {active === "Edit Labels" && (
        <section className="w-full min-h-screen">
          <Labels />
        </section>
      )}
    </main>
  );
}

export default HomePage;
