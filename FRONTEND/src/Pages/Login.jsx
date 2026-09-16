import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handelLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log("Login Error: ", error);
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
        px-4
        py-8
        bg-[#FFFAF3]
        dark:bg-[#202124]
        transition-colors
        duration-300
      "
    >
      {/* LOGIN CARD */}

      <div
        className="
          w-full
          max-w-md

          rounded-3xl

          bg-white
          dark:bg-[#2d2e30]

          border
          border-gray-200
          dark:border-[#3c4043]

          shadow-[0_10px_40px_rgba(0,0,0,0.12)]
          dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)]

          p-6
          sm:p-8

          transition-all
          duration-300
        "
      >
        {/* HEADER */}

        <div className="text-center mb-8">
          {/* LOGO */}

          <div
            className="
              mx-auto
              mb-5

              flex
              h-14
              w-14

              items-center
              justify-center

              rounded-2xl

              bg-yellow-400

              shadow-md
            "
          >
            <span className="text-2xl">💡</span>
          </div>

          <h1
            className="
              text-3xl
              font-bold

              text-gray-800
              dark:text-white
            "
          >
            Welcome Back!
          </h1>

          <p
            className="
              mt-2

              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Login to continue using Keep
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handelLogin}>
          {/* EMAIL */}

          <div className="mb-5">
            <label
              className="
                mb-2
                block

                text-sm
                font-semibold

                text-gray-700
                dark:text-gray-200
              "
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full

                  rounded-xl

                  border
                  border-gray-300
                  dark:border-[#4a4b4e]

                  bg-white
                  dark:bg-[#202124]

                  py-3
                  pl-12
                  pr-4

                  text-gray-800
                  dark:text-white

                  placeholder:text-gray-400

                  outline-none

                  transition-all

                  focus:border-yellow-400
                  focus:ring-4
                  focus:ring-yellow-400/20
                "
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="mb-5">
            <label
              className="
                mb-2
                block

                text-sm
                font-semibold

                text-gray-700
                dark:text-gray-200
              "
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full

                  rounded-xl

                  border
                  border-gray-300
                  dark:border-[#4a4b4e]

                  bg-white
                  dark:bg-[#202124]

                  py-3
                  pl-12
                  pr-12

                  text-gray-800
                  dark:text-white

                  placeholder:text-gray-400

                  outline-none

                  transition-all

                  focus:border-yellow-400
                  focus:ring-4
                  focus:ring-yellow-400/20
                "
                required
              />

              {/* SHOW / HIDE PASSWORD */}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400

                  hover:text-gray-700
                  dark:hover:text-white

                  transition
                "
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}

          {error && (
            <div
              className="
                mb-5

                rounded-xl

                border
                border-red-200

                bg-red-50

                px-4
                py-3

                text-sm
                text-red-600

                dark:border-red-900
                dark:bg-red-900/20
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

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

              font-semibold

              text-gray-800

              shadow-md

              transition-all
              duration-200

              hover:bg-yellow-500
              hover:shadow-lg

              active:scale-[0.98]
            "
          >
            Login
            <ArrowRight size={19} />
          </button>
        </form>

        {/* DIVIDER */}

        <div className="my-7 flex items-center gap-3">
          <div
            className="
              h-px
              flex-1

              bg-gray-200
              dark:bg-[#3c4043]
            "
          />

          <span
            className="
              text-xs

              text-gray-400
              dark:text-gray-500
            "
          >
            OR
          </span>

          <div
            className="
              h-px
              flex-1

              bg-gray-200
              dark:bg-[#3c4043]
            "
          />
        </div>

        {/* SIGNUP */}

        <p
          className="
            text-center

            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="
              ml-1

              font-semibold

              text-yellow-600
              dark:text-yellow-400

              hover:underline
            "
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
