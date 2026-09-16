import React from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Bell, Pencil, Archive, Trash2, Eye } from "lucide-react";

function SideBar({ open, active, setActive }) {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Notes", icon: Lightbulb },
    { name: "Reminder", icon: Bell },
    { name: "Recently Viewed", icon: Eye },
    { name: "Edit Labels", icon: Pencil },
    { name: "Archive", icon: Archive },
    { name: "Trash", icon: Trash2 },
  ];

  return (
    <aside
      className={`
    z-30
    shrink-0
    overflow-hidden
    border-r
    border-gray-200
    bg-white
    transition-all
    duration-300
    ease-in-out

    dark:border-[#3c4043]
    dark:bg-[#202124]

    /* MOBILE */
    fixed
    left-0
    top-16
    h-[calc(100vh-64px)]
    shadow-xl

    /* DESKTOP */
    md:relative
    md:top-0
    md:h-auto
    md:min-h-[calc(100vh-64px)]
    md:shadow-none

    ${open ? "w-full md:w-64" : "w-0 md:w-19"}
  `}
    >
      {/* MENU ITEMS */}
      <div className="flex flex-col gap-2 px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;

          return (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                if (item.name === "Reminder") {
                  navigate("/reminder");
                } else if (item.name === "Recently Viewed") {
                  navigate("/recently-viewed");
                } else if (item.name === "Edit Labels") {
                  navigate("/labels");
                } else if (item.name === "Archive") {
                  navigate("/archive");
                } else if (item.name === "Trash") {
                  navigate("/trash");
                } else {
                  navigate("/");
                }
              }}
              title={!open ? item.name : ""}
              className={`
                group
                relative
                flex
                w-full
                items-center
                rounded-2xl
                px-3
                py-3.5
                text-left
                transition-all
                duration-300

                ${open ? "justify-start gap-4" : "justify-center"}

                ${
                  isActive
                    ? `
                      bg-yellow-300
                      text-gray-900
                      shadow-md
                      shadow-yellow-300/20
                    `
                    : `
                      text-gray-500
                      hover:bg-gray-100
                      hover:text-gray-900

                      dark:text-gray-400
                      dark:hover:bg-[#303134]
                      dark:hover:text-white
                    `
                }
              `}
            >
              {/* ACTIVE INDICATOR */}
              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    h-7
                    w-1
                    rounded-r-full
                    bg-yellow-600
                  "
                />
              )}

              {/* ICON */}
              <span
                className={`
                  flex
                  shrink-0
                  items-center
                  justify-center
                  transition-transform
                  duration-300

                  ${isActive ? "text-gray-900" : "group-hover:scale-110"}
                `}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              </span>

              {/* TEXT */}
              <span
                className={`
                  overflow-hidden
                  whitespace-nowrap
                  text-[15px]
                  font-medium
                  transition-all
                  duration-300
                  ease-in-out

                  ${
                    open
                      ? "max-w-40 opacity-100 translate-x-0"
                      : "max-w-0 opacity-0 -translate-x-3"
                  }

                  ${isActive ? "font-semibold" : ""}
                `}
              >
                {item.name}
              </span>

              {/* COLLAPSED TOOLTIP */}
              {!open && (
                <span
                  className="
                    pointer-events-none
                    absolute
                    left-19.5
                    top-1/2
                    z-50
                    -translate-y-1/2

                    whitespace-nowrap
                    rounded-lg
                    bg-gray-900
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-white
                    opacity-0
                    shadow-lg

                    transition-all
                    duration-200

                    group-hover:opacity-100
                    group-hover:translate-x-1

                    dark:bg-white
                    dark:text-gray-900
                  "
                >
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* BOTTOM SUBTLE DIVIDER / BRAND AREA */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          border-t
          border-gray-100
          px-4
          py-4

          dark:border-[#3c4043]
        "
      >
        <div
          className={`
            flex
            items-center
            text-xs
            text-gray-400
            transition-all
            duration-300

            dark:text-gray-500

            ${open ? "justify-start" : "justify-center"}
          `}
        >
          <span
            className={`
              overflow-hidden
              whitespace-nowrap
              transition-all
              duration-300

              ${open ? "max-w-40 opacity-100" : "max-w-0 opacity-0"}
            `}
          >
            Keep Notes
          </span>

          {!open && <span className="h-2 w-2 rounded-full bg-yellow-400" />}
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
