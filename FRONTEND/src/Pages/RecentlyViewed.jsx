import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Clock3 } from "lucide-react";

function RecentlyViewed({ darkMode }) {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/notes/recently-viewed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recently viewed notes");
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Recently Viewed Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  const formatViewedTime = (date) => {
    if (!date) return "";

    const viewedDate = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.floor((now - viewedDate) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 1) {
      return "Yesterday";
    }

    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    return viewedDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[calc(100vh-65px)]
          items-center
          justify-center
          bg-white
          text-gray-500
          dark:bg-[#202124]
          dark:text-gray-400
        "
      >
        Loading recently viewed notes...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-[calc(100vh-65px)]
        bg-white
        px-4
        py-6
        transition-colors
        dark:bg-[#202124]
      "
    >
      {/* HEADER */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-yellow-100
              text-yellow-700
              dark:bg-yellow-900/30
              dark:text-yellow-400
            "
          >
            <Eye size={22} />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Recently Viewed
            </h1>

            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Notes you opened recently
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {notes.length === 0 ? (
          <div
            className="
              flex
              min-h-72
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              text-center
              dark:border-[#3c4043]
              dark:bg-[#292a2d]
            "
          >
            <Eye size={48} strokeWidth={1.5} className="mb-3 text-gray-400" />

            <h2
              className="
                text-lg
                font-medium
                text-gray-700
                dark:text-gray-200
              "
            >
              No recently viewed notes
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Open a note and it will appear here.
            </p>
          </div>
        ) : (
          /* NOTES GRID */
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {notes.map((note) => (
              <div
                key={note._id}
                onClick={() => navigate(`/edit-note/${note._id}`)}
                className="
                  group
                  cursor-pointer
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-lg
                  dark:border-[#3c4043]
                  dark:bg-[#292a2d]
                  dark:hover:bg-[#303134]
                "
              >
                {/* NOTE TITLE */}
                <h2
                  className="
                    mb-3
                    line-clamp-2
                    text-lg
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {note.title || "Untitled Note"}
                </h2>

                {/* NOTE CONTENT */}
                <p
                  className="
                    mb-5
                    line-clamp-4
                    text-sm
                    leading-6
                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  {note.content || "No content"}
                </p>

                {/* FOOTER */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  <Clock3 size={14} />

                  <span>Viewed {formatViewedTime(note.lastViewedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentlyViewed;
