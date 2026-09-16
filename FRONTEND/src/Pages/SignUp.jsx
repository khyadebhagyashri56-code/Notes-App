import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // SIGNUP LOGIC
  // =========================

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("SignUp Successful!");

      navigate("/login");

      console.log(data);
    } catch (error) {
      console.log("SignUp Error: ", error);
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full

        flex
        items-center
        justify-center

        bg-[#FFFAF3]
        dark:bg-[#202124]

        px-4
        py-8

        sm:px-6

        transition-colors
        duration-300
      "
    >
      {/* =========================
          MAIN SIGNUP CARD
      ========================= */}

      <div
        className="
          w-full
          max-w-5xl

          overflow-hidden

          rounded-3xl

          bg-white
          dark:bg-[#2d2e30]

          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]

          grid

          md:grid-cols-2

          transition-colors
          duration-300
        "
      >
        {/* =========================
            LEFT SIDE
        ========================= */}

        <div
          className="
            hidden

            md:flex
            flex-col
            justify-between

            bg-[#FFD54F]

            p-10

            lg:p-14
          "
        >
          {/* LOGO */}

          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                bg-white

                shadow-sm
              "
            >
              <Lightbulb size={26} className="text-yellow-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Keep</h2>
          </div>

          {/* CONTENT */}

          <div>
            <h1
              className="
                text-4xl
                font-bold

                leading-tight

                text-gray-900

                lg:text-5xl
              "
            >
              Keep your ideas
              <br />
              organized.
            </h1>

            <p
              className="
                mt-6

                max-w-sm

                text-base

                leading-7

                text-gray-700
              "
            >
              Capture your thoughts, organize your ideas, and keep everything
              important in one place.
            </p>
          </div>

          {/* BOTTOM TEXT */}

          <p className="text-sm font-medium text-gray-700">
            Simple. Fast. Organized.
          </p>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div
          className="
            flex
            flex-col
            justify-center

            p-7

            sm:p-10

            lg:p-14

            bg-white
            dark:bg-[#2d2e30]

            transition-colors
            duration-300
          "
        >
          {/* MOBILE LOGO */}

          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div
              className="
                flex
                h-11
                w-11

                items-center
                justify-center

                rounded-xl

                bg-yellow-400
              "
            >
              <Lightbulb size={24} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Keep
            </h2>
          </div>

          {/* HEADING */}

          <div className="mb-8">
            <h1
              className="
                text-3xl
                font-bold

                text-gray-900
                dark:text-white

                transition-colors
                duration-300
              "
            >
              Create an account
            </h1>

            <p
              className="
                mt-2

                text-sm

                text-gray-500
                dark:text-gray-400

                transition-colors
                duration-300
              "
            >
              Start organizing your thoughts today.
            </p>
          </div>

          {/* =========================
              FORM
          ========================= */}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* =========================
                NAME
            ========================= */}

            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-gray-300
                "
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="
                    absolute

                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-gray-400
                    dark:text-gray-500
                  "
                />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="
                    w-full

                    rounded-xl

                    border
                    border-gray-200
                    dark:border-[#3c4043]

                    bg-white
                    dark:bg-[#202124]

                    py-3
                    pl-12
                    pr-4

                    text-sm

                    text-gray-900
                    dark:text-white

                    outline-none

                    transition-all
                    duration-200

                    placeholder:text-gray-400
                    dark:placeholder:text-gray-500

                    focus:border-yellow-400
                    focus:ring-4
                    focus:ring-yellow-400/20
                  "
                />
              </div>
            </div>

            {/* =========================
                EMAIL
            ========================= */}

            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-gray-300
                "
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="
                    absolute

                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-gray-400
                    dark:text-gray-500
                  "
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                    w-full

                    rounded-xl

                    border
                    border-gray-200
                    dark:border-[#3c4043]

                    bg-white
                    dark:bg-[#202124]

                    py-3
                    pl-12
                    pr-4

                    text-sm

                    text-gray-900
                    dark:text-white

                    outline-none

                    transition-all
                    duration-200

                    placeholder:text-gray-400
                    dark:placeholder:text-gray-500

                    focus:border-yellow-400
                    focus:ring-4
                    focus:ring-yellow-400/20
                  "
                />
              </div>
            </div>

            {/* =========================
                PASSWORD
            ========================= */}

            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-gray-300
                "
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="
                    absolute

                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-gray-400
                    dark:text-gray-500
                  "
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                    w-full

                    rounded-xl

                    border
                    border-gray-200
                    dark:border-[#3c4043]

                    bg-white
                    dark:bg-[#202124]

                    py-3
                    pl-12
                    pr-12

                    text-sm

                    text-gray-900
                    dark:text-white

                    outline-none

                    transition-all
                    duration-200

                    placeholder:text-gray-400
                    dark:placeholder:text-gray-500

                    focus:border-yellow-400
                    focus:ring-4
                    focus:ring-yellow-400/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute

                    right-4
                    top-1/2

                    -translate-y-1/2

                    text-gray-400
                    dark:text-gray-500

                    transition

                    hover:text-gray-700
                    dark:hover:text-white
                  "
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* =========================
                SIGN UP BUTTON
            ========================= */}

            <button
              type="submit"
              className="
                flex
                w-full

                items-center
                justify-center
                gap-2

                rounded-xl

                bg-yellow-400

                py-3.5

                text-sm
                font-semibold

                text-gray-900

                shadow-sm

                transition-all
                duration-200

                hover:bg-yellow-500
                hover:shadow-md

                active:scale-[0.98]
              "
            >
              Create Account
              <ArrowRight size={18} />
            </button>
          </form>

          {/* =========================
              LOGIN
          ========================= */}

          <p
            className="
              mt-7

              text-center

              text-sm

              text-gray-500
              dark:text-gray-400
            "
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                font-semibold

                text-yellow-600
                dark:text-yellow-400

                transition

                hover:text-yellow-700
                dark:hover:text-yellow-300

                hover:underline
              "
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
