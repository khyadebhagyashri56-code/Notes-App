import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import SideBar from "./Components/SideBar.jsx";
import HomePage from "./Pages/HomePage.jsx";
import SignUp from "./Pages/SignUp.jsx";
import EditNote from "./Pages/EditNote.jsx";
import Login from "./Pages/Login.jsx";
import "./App.css";
import Toast from "./Components/Toast.jsx";
import Reminder from "./Components/Reminder.jsx";
import Labels from "./Pages/Labels.jsx";
import ChangePassword from "./Pages/ChangePassword";
import SharedNote from "./Pages/SharedNote.jsx";
import RecentlyViewed from "./Pages/RecentlyViewed.jsx";
import NoteView from "./Pages/NotesView.jsx";

function Layout() {
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Notes");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (location.pathname === "/reminder") {
      setActive("Reminder");
    } else if (location.pathname === "/archive") {
      setActive("Archive");
    } else if (location.pathname === "/trash") {
      setActive("Trash");
    } else if (location.pathname === "/") {
      setActive("Notes");
    } else if (location.pathname === "/recently-viewed") {
      setActive("Recently Viewed");
    }
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === "/signup" || location.pathname == "/login";

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {!isAuthPage && (
        <Navbar
          open={open}
          setOpen={setOpen}
          search={search}
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      <div className="flex min-h-[calc(100vh-65px)] w-full">
        {!isAuthPage && (
          <SideBar open={open} active={active} setActive={setActive} />
        )}

        <main className="min-w-0 flex-1 w-full">
          <Routes>
            <Route
              path="/archive"
              element={
                <HomePage
                  active="Archive"
                  search={search}
                  setToast={setToast}
                  darkMode={darkMode}
                />
              }
            />

            <Route
              path="/trash"
              element={
                <HomePage
                  active="Trash"
                  search={search}
                  setToast={setToast}
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/"
              element={
                <HomePage
                  active={active}
                  search={search}
                  setToast={setToast}
                  darkMode={darkMode}
                />
              }
            />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit-note/:id" element={<EditNote />} />
            <Route
              path="/reminder"
              element={<Reminder setToast={setToast} />}
            />
            <Route path="/labels" element={<Labels />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route
              path="/shared/:shareId"
              element={<SharedNote darkMode={darkMode} />}
            />
            <Route
              path="/recently-viewed"
              element={<RecentlyViewed darkMode={darkMode} />}
            />
            <Route
              path="/view-note/:id"
              element={<NoteView darkMode={darkMode} />}
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </>
  );
}

export default App;
