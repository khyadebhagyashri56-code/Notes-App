import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag, X, Check } from "lucide-react";

function Labels() {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [editLabel, setEditLabel] = useState(null);

  // =========================
  // FETCH LABELS
  // =========================

  const fetchLabels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/labels");

      const data = await response.json();

      setLabels(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  // =========================
  // ADD LABEL
  // =========================

  const addLabel = async () => {
    if (newLabel.trim() === "") return;

    try {
      const response = await fetch("http://localhost:5000/api/labels", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: newLabel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setLabels((prevLabels) => [...prevLabels, data]);

      setNewLabel("");
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DELETE LABEL
  // =========================

  const deleteLabel = async (label) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/labels/${label._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setLabels((prevLabels) =>
        prevLabels.filter((item) => item._id !== label._id),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // UPDATE LABEL
  // =========================

  const updateLabel = async () => {
    if (newLabel.trim() === "") return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/labels/${editLabel._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: newLabel,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setLabels((prevLabels) =>
        prevLabels.map((label) => (label._id === data._id ? data : label)),
      );

      setEditLabel(null);

      setNewLabel("");
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditLabel(null);
    setNewLabel("");
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      className="
        min-h-screen
        w-full

        bg-white
        text-gray-900

        transition-colors
        duration-300

        dark:bg-[#202124]
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-4xl

          px-5
          py-10

          sm:px-8
          lg:px-10
        "
      >
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-blue-50
                text-blue-600

                dark:bg-blue-500/10
                dark:text-blue-400
              "
            >
              <Tag size={23} />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold

                  text-gray-900

                  dark:text-white
                "
              >
                Edit Labels
              </h1>

              <p
                className="
                  mt-1
                  text-sm

                  text-gray-500

                  dark:text-gray-400
                "
              >
                Create, edit and manage your note labels.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            ADD / EDIT CARD
        ========================= */}

        <div
          className="
            mb-8

            rounded-2xl

            border
            border-gray-200

            bg-white

            p-5

            shadow-sm

            dark:border-[#3c4043]
            dark:bg-[#2d2e30]
          "
        >
          <h2
            className="
              mb-4

              text-base
              font-semibold

              text-gray-800

              dark:text-white
            "
          >
            {editLabel ? "Edit Label" : "Create New Label"}
          </h2>

          <div
            className="
              flex
              flex-col
              gap-3

              sm:flex-row
            "
          >
            <div className="relative flex-1">
              <Tag
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2

                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Enter label name"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editLabel ? updateLabel() : addLabel();
                  }
                }}
                className="
                  w-full

                  rounded-xl

                  border
                  border-gray-200

                  bg-white

                  py-3
                  pl-12
                  pr-4

                  text-sm

                  text-gray-900

                  outline-none

                  transition-all
                  duration-200

                  placeholder:text-gray-400

                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20

                  dark:border-[#3c4043]
                  dark:bg-[#202124]
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={editLabel ? updateLabel : addLabel}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-blue-600

                  px-5
                  py-3

                  text-sm
                  font-semibold

                  text-white

                  shadow-sm

                  transition-all
                  duration-200

                  hover:bg-blue-700
                  hover:shadow-md

                  active:scale-95
                "
              >
                {editLabel ? (
                  <>
                    <Check size={18} />
                    Save
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add Label
                  </>
                )}
              </button>

              {editLabel && (
                <button
                  onClick={cancelEdit}
                  className="
                    flex
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-gray-200

                    px-4

                    text-gray-500

                    transition-all

                    hover:bg-gray-100

                    dark:border-[#3c4043]
                    dark:text-gray-300
                    dark:hover:bg-[#3c4043]
                  "
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            LABELS HEADER
        ========================= */}

        <div className="mb-4 flex items-center justify-between">
          <h2
            className="
              text-lg
              font-semibold

              text-gray-800

              dark:text-white
            "
          >
            Your Labels
          </h2>

          <span
            className="
              rounded-full

              bg-gray-100

              px-3
              py-1

              text-xs
              font-medium

              text-gray-500

              dark:bg-[#303134]
              dark:text-gray-300
            "
          >
            {labels.length} {labels.length === 1 ? "Label" : "Labels"}
          </span>
        </div>

        {/* =========================
            LABEL LIST
        ========================= */}

        {labels.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center

              rounded-2xl

              border
              border-dashed
              border-gray-300

              bg-gray-50

              py-14

              text-center

              dark:border-[#3c4043]
              dark:bg-[#2d2e30]
            "
          >
            <div
              className="
                mb-4

                flex
                h-14
                w-14

                items-center
                justify-center

                rounded-full

                bg-white

                text-gray-400

                shadow-sm

                dark:bg-[#303134]
              "
            >
              <Tag size={25} />
            </div>

            <h3
              className="
                text-base
                font-semibold

                text-gray-700

                dark:text-gray-200
              "
            >
              No labels yet
            </h3>

            <p
              className="
                mt-1

                text-sm

                text-gray-500

                dark:text-gray-400
              "
            >
              Create your first label to organize your notes.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {labels.map((label) => (
              <div
                key={label._id}
                className="
                  group

                  flex
                  items-center
                  justify-between

                  rounded-xl

                  border
                  border-gray-200

                  bg-white

                  px-5
                  py-4

                  shadow-sm

                  transition-all
                  duration-200

                  hover:border-blue-200
                  hover:shadow-md

                  dark:border-[#3c4043]
                  dark:bg-[#2d2e30]
                  dark:hover:border-blue-500/50
                "
              >
                {/* LABEL NAME */}

                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10

                      items-center
                      justify-center

                      rounded-lg

                      bg-blue-50

                      text-blue-600

                      dark:bg-blue-500/10
                      dark:text-blue-400
                    "
                  >
                    <Tag size={18} />
                  </div>

                  <span
                    className="
                      font-medium

                      text-gray-800

                      dark:text-gray-100
                    "
                  >
                    {label.name}
                  </span>
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditLabel(label);
                      setNewLabel(label.name);
                    }}
                    className="
                      flex
                      h-10
                      w-10

                      items-center
                      justify-center

                      rounded-lg

                      text-blue-600

                      transition-all

                      hover:bg-blue-50

                      dark:text-blue-400
                      dark:hover:bg-blue-500/10
                    "
                    title="Edit label"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteLabel(label)}
                    className="
                      flex
                      h-10
                      w-10

                      items-center
                      justify-center

                      rounded-lg

                      text-red-500

                      transition-all

                      hover:bg-red-50

                      dark:hover:bg-red-500/10
                    "
                    title="Delete label"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Labels;
