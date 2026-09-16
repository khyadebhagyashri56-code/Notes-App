import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LockKeyhole,
  LogOut,
  ChevronDown,
} from "lucide-react";
import NotesIcon from "../Media/NotesIcon.png";

function Navbar({ open, setOpen, search, setSearch, darkMode, setDarkMode }) {
  const [clicked, setClicked] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  return (
    <nav
      className="
        sticky top-0 z-40 w-full
        border-b border-gray-200
        bg-[#FFFAF3]
        px-3 py-3
        shadow-sm
        transition-all duration-300
        dark:border-[#3c4043]
        dark:bg-[#202124]
        sm:px-4
      "
    >
      {/* ================= MOBILE SEARCH ================= */}

      {mobileSearchOpen && (
        <div className="flex items-center gap-2 lg:hidden">
          {/* CLOSE SEARCH */}

          <button
            onClick={() => {
              setMobileSearchOpen(false);
              setSearch("");
            }}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-gray-600
              transition-all
              hover:bg-gray-200
              active:scale-95
              dark:text-gray-300
              dark:hover:bg-[#303134]
            "
            aria-label="Close Search"
          >
            <X size={22} />
          </button>

          {/* SEARCH INPUT */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={19}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-500
                dark:text-gray-400
              "
            />

            <input
              autoFocus
              type="text"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 dark:border-[#3c4043] dark:bg-[#292a2d] dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      )}

      <div
        className={`
          ${mobileSearchOpen ? "hidden lg:flex" : "flex"}

          w-full
          items-center
          gap-3
        `}
      >
        {/* ================= LEFT ================= */}

        <div className="flex shrink-0 items-center gap-3">
          {/* MENU */}

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition-all duration-200 hover:bg-gray-200 active:scale-95 dark:text-gray-300 dark:hover:bg-[#303134]"
            aria-label="Toggle Sidebar"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* LOGO */}

          <div className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-[#292a2d]">
              <img
                src={NotesIcon}
                className="h-8 w-8 object-contain"
                alt="Notes Icon"
              />
            </div>

            <span className="hidden text-2xl font-semibold tracking-tight text-gray-900 sm:block dark:text-white">
              Keep
            </span>
          </div>
        </div>

        {/* ================= DESKTOP SEARCH ================= */}

        <div
          className="hidden min-w-0 flex-1 lg:flex
          "
        >
          <div className="relative mx-4 w-full max-w-4xl lg:mx-8">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />

            <input
              type="text"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 dark:border-[#3c4043] dark:bg-[#292a2d] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-yellow-300 dark:focus:ring-yellow-300/10"
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* MOBILE SEARCH BUTTON */}

          <button
            onClick={() => setMobileSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-all hover:bg-gray-200 active:scale-95 lg:hidden dark:text-gray-300 dark:hover:bg-[#303134]"
            aria-label="Search"
          >
            <Search size={21} />
          </button>

          {/* DARK MODE */}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-700 transition-all duration-200 hover:bg-gray-200 active:scale-95 dark:text-yellow-300 dark:hover:bg-[#303134]"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={21} /> : <Moon size={21} />}
          </button>

          {/* SIGN UP */}

          {/* PROFILE */}

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
      flex
      items-center
      gap-2
      rounded-xl
      border
      border-gray-200
      bg-white
      px-3
      py-2
      text-gray-700
      transition-all
      hover:bg-gray-100
      active:scale-95

      dark:border-[#3c4043]
      dark:bg-[#292a2d]
      dark:text-white
      dark:hover:bg-[#303134]
    "
            >
              <div
                className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        bg-yellow-400
        text-gray-800
      "
              >
                <User size={18} />
              </div>

              <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                {user?.name || "Account"}
              </span>

              <ChevronDown
                size={16}
                className={`hidden transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* PROFILE DROPDOWN */}

            {profileOpen && (
              <div
                className="
        absolute
        right-0
        top-12
        z-50
        w-64
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-xl

        dark:border-[#3c4043]
        dark:bg-[#292a2d]
      "
              >
                {/* USER INFO */}

                <div
                  className="
          border-b
          border-gray-100
          px-4
          py-4
          dark:border-[#3c4043]
        "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-yellow-400
              font-semibold
              text-gray-800
            "
                    >
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800 dark:text-white">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CHANGE PASSWORD */}

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/change-password");
                  }}
                  className="
          flex
          w-full
          items-center
          gap-3
          px-4
          py-3
          text-left
          text-sm
          text-gray-700
          transition
          hover:bg-gray-100

          dark:text-gray-200
          dark:hover:bg-[#303134]
        "
                >
                  <LockKeyhole size={18} />
                  <span>Change Password</span>
                </button>

                {/* LOGOUT */}

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setProfileOpen(false);
                    navigate("/login");
                  }}
                  className="
          flex
          w-full
          items-center
          gap-3
          border-t
          border-gray-100
          px-4
          py-3
          text-left
          text-sm
          text-red-500
          transition
          hover:bg-red-50

          dark:border-[#3c4043]
          dark:hover:bg-red-900/20
        "
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
