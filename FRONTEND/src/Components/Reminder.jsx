import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Clock3,
  MoreVertical,
  Plus,
  Search,
  CheckCircle2,
  X,
} from "lucide-react";

function Reminder({ setToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const noteData = location.state;

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [notifiedReminders, setNotifiedReminders] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    if (location.state) {
      setFormData({
        title: location.state.title || "",
        description: location.state.description || "",
        date: "",
        time: "",
      });

      setShowModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const [reminders, setReminders] = useState({
    Today: [
      {
        id: 1,
        title: "Complete DBMS Assignment",
        date: "19 Aug 2026",
        time: "6:00 PM",
        description: "Submit the assignment before the college deadline.",
      },
      {
        id: 2,
        title: "Call Professor",
        date: "19 Aug 2026",
        time: "8:30 PM",
        description: "Discuss about the project guidance.",
      },
    ],

    Tomorrow: [
      {
        id: 3,
        title: "React Project Progress",
        date: "20 Aug 2026",
        time: "10:00 AM",
        description: "Work on frontend UI and fix the bugs.",
      },
    ],

    Upcoming: [
      {
        id: 4,
        title: "Buy New Notebook",
        date: "22 Aug 2026",
        time: "5:00 PM",
        description: "Buy a new notebook for college notes.",
      },
      {
        id: 5,
        title: "Prepare for Placement Test",
        date: "25 Aug 2026",
        time: "11:00 AM",
        description: "Aptitude + DSA practice.",
      },
    ],

    Completed: [
      {
        id: 6,
        title: "Complete Java Practice",
        date: "18 Aug 2026",
        time: "7:00 AM",
        description: "Completed today's Java practice.",
      },
    ],
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reminders");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reminders");
      }

      const groupedReminders = {
        Today: [],
        Tomorrow: [],
        Upcoming: [],
        Completed: [],
      };

      const today = new Date();

      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      const tomorrowDate = new Date(todayDate);
      tomorrowDate.setDate(todayDate.getDate() + 1);

      data.forEach((reminder) => {
        const reminderDate = new Date(reminder.date);

        const reminderOnlyDate = new Date(
          reminderDate.getFullYear(),
          reminderDate.getMonth(),
          reminderDate.getDate(),
        );

        let section = "Upcoming";

        if (reminder.completed === true) {
          section = "Completed";
        } else if (reminderOnlyDate.getTime() === todayDate.getTime()) {
          section = "Today";
        } else if (reminderOnlyDate.getTime() === tomorrowDate.getTime()) {
          section = "Tomorrow";
        }

        groupedReminders[section].push({
          id: reminder._id,
          title: reminder.title,
          description: reminder.description || "",

          date: new Date(reminder.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),

          originalDate: reminder.date,

          time: reminder.time,

          completed: reminder.completed,
        });
      });

      setReminders(groupedReminders);
    } catch (error) {
      console.error("Fetch reminders error:", error);

      setToast({
        message: "Failed to load reminders",
        type: "error",
      });
    }
  };

  const checkReminders = () => {
    const now = new Date();

    Object.values(reminders)
      .flat()
      .forEach((reminder) => {
        if (reminder.completed) return;

        const reminderDateTime = new Date(
          `${reminder.originalDate}T${reminder.time}:00`,
        );

        const difference = now.getTime() - reminderDateTime.getTime();

        if (
          difference >= 0 &&
          difference < 60000 &&
          !notifiedReminders.includes(reminder.id)
        ) {
          if (Notification.permission === "granted") {
            new Notification("🔔 Reminder", {
              body: reminder.title,
            });

            setNotifiedReminders((prev) => [...prev, reminder.id]);
          }
        }
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders();
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders, notifiedReminders]);

  const completeReminder = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reminders/${id}/complete`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || "Failed to complete reminder",
          type: "error",
        });
        return;
      }

      setReminders((prev) => {
        let completedReminder = null;

        const updatedReminders = {
          Today: prev.Today.filter((reminder) => {
            if (reminder.id === id) {
              completedReminder = {
                ...reminder,
                completed: true,
              };
              return false;
            }
            return true;
          }),

          Tomorrow: prev.Tomorrow.filter((reminder) => {
            if (reminder.id === id) {
              completedReminder = {
                ...reminder,
                completed: true,
              };
              return false;
            }
            return true;
          }),

          Upcoming: prev.Upcoming.filter((reminder) => {
            if (reminder.id === id) {
              completedReminder = {
                ...reminder,
                completed: true,
              };
              return false;
            }
            return true;
          }),

          Completed: prev.Completed,
        };

        if (completedReminder) {
          updatedReminders.Completed = [...prev.Completed, completedReminder];
        }

        return updatedReminders;
      });

      setToast({
        message: "Reminder marked as completed! 🎉",
        type: "success",
      });
    } catch (error) {
      console.error("Complete reminder error:", error);

      setToast({
        message: "Server error. Please try again",
        type: "error",
      });
    }
  };

  const deleteReminder = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reminders/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || "Failed to delete reminder",
          type: "error",
        });
        return;
      }

      setReminders((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((section) => {
          updated[section] = updated[section].filter(
            (reminder) => reminder.id !== id,
          );
        });

        return updated;
      });

      setToast({
        message: "Reminder deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Delete reminder error: ", error);

      setToast({
        message: "Server error. Make sure backend is running",
        type: "error",
      });
    }
  };

  const tabs = ["All", "Today", "Tomorrow", "Upcoming", "Completed"];

  const filterReminders = (list) => {
    return list.filter((reminder) =>
      `${reminder.title} ${reminder.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  };

  const sections =
    activeTab === "All"
      ? ["Today", "Tomorrow", "Upcoming", "Completed"]
      : [activeTab];

  // OPEN NEW REMINDER MODAL

  const openNewReminder = () => {
    if (noteData) {
      setFormData({
        title: noteData.title || "",
        description: noteData.description || "",
        date: "",
        time: "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
      });
    }

    setShowModal(true);
  };

  // SAVE REMINDER

  const saveReminder = async () => {
    if (!formData.title.trim() || !formData.date || !formData.time) {
      setToast({
        message: "Please fill title, date and time",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reminders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: formData.date,
          time: formData.time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || "Failed to create reminder",
          type: "error",
        });
        return;
      }

      console.log("Reminder saved:", data);

      const selectedDate = new Date(`${formData.date}T00:00:00`);

      const today = new Date();

      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      const tomorrowDate = new Date(todayDate);

      tomorrowDate.setDate(tomorrowDate.getDate() + 1);

      let section = "Upcoming";

      if (selectedDate.getTime() === todayDate.getTime()) {
        section = "Today";
      } else if (selectedDate.getTime() === tomorrowDate.getTime()) {
        section = "Tomorrow";
      }

      const newReminder = {
        id: data._id,

        title: data.title,

        date: new Date(`${data.date}T00:00:00`).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),

        originalDate: data.date,

        time: data.time,

        description: data.description || "",

        completed: false,
      };

      setReminders((prev) => ({
        ...prev,

        [section]: [...prev[section], newReminder],
      }));

      setFormData({
        title: "",
        date: "",
        time: "",
        description: "",
      });

      setShowModal(false);

      setToast({
        message: "Reminder created successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Save reminder error:", error);

      setToast({
        message: "Server error. Make sure backend is running.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex-1 bg-white px-4 py-6 text-gray-900 transition-colors duration-300 dark:bg-[#202124] dark:text-white sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 pb-6 dark:border-[#3c4043]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 dark:bg-yellow-300">
              <Bell size={24} className="text-yellow-700 dark:text-gray-900" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Reminders
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Stay on top of what matters
              </p>
            </div>
          </div>

          {/* SEARCH + BUTTON */}

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* SEARCH */}

            <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-[#3c4043] dark:bg-[#202124] sm:w-80">
              <Search
                size={20}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />

              <input
                type="text"
                placeholder="Search reminders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            {/* NEW REMINDER */}

            <button
              onClick={openNewReminder}
              className="flex items-center justify-center gap-2 rounded-xl bg-yellow-300 px-5 py-3 font-medium text-gray-900 shadow-sm transition hover:bg-yellow-400 hover:shadow-md active:scale-[0.98]"
            >
              <Plus size={20} />
              New Reminder
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex w-max items-center gap-1 rounded-full border border-gray-200 bg-white p-1.5 dark:border-[#3c4043] dark:bg-[#202124]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-yellow-100 text-gray-900 shadow-sm dark:bg-yellow-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#303134]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ================= REMINDER SECTIONS ================= */}

      <div className="mt-8 space-y-10">
        {sections.map((section) => {
          const filtered = filterReminders(reminders[section]);

          if (filtered.length === 0) return null;

          return (
            <div key={section}>
              {/* SECTION HEADING */}

              <div className="mb-5 flex items-center gap-3">
                {section === "Today" && <span className="text-xl">☀️</span>}

                {section === "Tomorrow" && (
                  <CalendarDays size={22} className="text-blue-500" />
                )}

                {section === "Upcoming" && (
                  <CalendarDays size={22} className="text-purple-500" />
                )}

                {section === "Completed" && (
                  <CheckCircle2 size={22} className="text-green-500" />
                )}

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {section}
                </h2>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-[#303134] dark:text-gray-300">
                  {filtered.length}
                </span>
              </div>

              {/* CARDS */}

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filtered.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`group relative rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-[#3c4043] ${
                      section === "Completed"
                        ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                        : "border-gray-200 bg-white dark:bg-[#202124]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* BELL ICON */}

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          section === "Today"
                            ? "bg-yellow-100"
                            : section === "Tomorrow"
                              ? "bg-blue-100"
                              : section === "Upcoming"
                                ? "bg-purple-100"
                                : "bg-green-100"
                        }`}
                      >
                        <Bell
                          size={22}
                          className={
                            section === "Today"
                              ? "text-yellow-600"
                              : section === "Tomorrow"
                                ? "text-blue-600"
                                : section === "Upcoming"
                                  ? "text-purple-600"
                                  : "text-green-600"
                          }
                        />
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-base font-semibold text-gray-800 dark:text-white ${
                            section === "Completed"
                              ? "line-through opacity-60"
                              : ""
                          }`}
                        >
                          {reminder.title}
                        </h3>

                        {/* DATE + TIME */}

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={16} />
                            {reminder.date}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock3 size={16} />
                            {reminder.time}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          {reminder.description}
                        </p>
                      </div>

                      {/* MENU */}

                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === reminder.id ? null : reminder.id,
                            )
                          }
                          className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#303134]"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenu === reminder.id && (
                          <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-[#3c4043] dark:bg-[#202124]">
                            {section !== "Completed" && (
                              <button
                                onClick={() => {
                                  completeReminder(reminder.id);
                                  setOpenMenu(null);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-green-600 transition hover:bg-gray-100 dark:hover:bg-[#303134]"
                              >
                                <CheckCircle2 size={17} />
                                Mark as Complete
                              </button>
                            )}

                            <button
                              onClick={() => {
                                deleteReminder(reminder.id);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <X size={17} />
                              Delete Reminder
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= NEW REMINDER MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-colors dark:bg-[#202124] sm:p-7">
            {/* MODAL HEADER */}

            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-300">
                  <Bell
                    size={20}
                    className="text-yellow-700 dark:text-gray-900"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    New Reminder
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add a reminder and never miss it
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/");
                }}
                className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#303134]"
              >
                <X size={20} />
              </button>
            </div>

            {/* TITLE */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reminder title
              </label>

              <input
                type="text"
                placeholder="What do you want to remember?"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 dark:border-[#3c4043] dark:bg-[#202124] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-yellow-300/20"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>

              <textarea
                placeholder="Add some details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 dark:border-[#3c4043] dark:bg-[#202124] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-yellow-300/20"
              />
            </div>

            {/* DATE + TIME */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* DATE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 transition dark:border-[#3c4043] dark:bg-[#202124]">
                  <CalendarDays
                    size={18}
                    className="shrink-0 text-gray-500 dark:text-gray-400"
                  />

                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                    className="w-full bg-transparent text-sm text-gray-800 outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* TIME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 transition dark:border-[#3c4043] dark:bg-[#202124]">
                  <Clock3
                    size={18}
                    className="shrink-0 text-gray-500 dark:text-gray-400"
                  />

                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        time: e.target.value,
                      })
                    }
                    className="w-full bg-transparent text-sm text-gray-800 outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#303134]"
              >
                Cancel
              </button>

              <button
                onClick={saveReminder}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-400 hover:shadow-md active:scale-[0.98]"
              >
                <Bell size={18} />
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminder;
