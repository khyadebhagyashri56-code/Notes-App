import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

// =====================================================
// PASSWORD INPUT COMPONENT
// IMPORTANT: This is OUTSIDE ChangePassword
// =====================================================

const PasswordInput = ({
  value,
  setValue,
  placeholder,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div className="relative">
      {/* Lock Icon */}
      <Lock
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Password Input */}
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-11
          pr-12
          py-3.5
          rounded-2xl
          border
          border-gray-200
          dark:border-[#3a3a3a]
          bg-gray-50
          dark:bg-[#292929]
          text-gray-800
          dark:text-white
          placeholder:text-gray-400
          outline-none
          focus:border-yellow-400
          focus:ring-2
          focus:ring-yellow-400/20
          transition
        "
      />

      {/* Show / Hide Password */}
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
          dark:hover:text-gray-200
        "
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

// =====================================================
// CHANGE PASSWORD PAGE
// =====================================================

function ChangePassword() {
  const navigate = useNavigate();

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show / Hide states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // CHANGE PASSWORD FUNCTION
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check new password length
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    // Check password confirmation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      // Success message
      setMessage("Password changed successfully");

      // Clear inputs
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Change Password Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#f5f5f5]
        dark:bg-[#111111]
        px-4
        py-6
        md:px-8
        md:py-10
        transition-colors
      "
    >
      <div className="max-w-3xl mx-auto">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-full
              bg-white
              dark:bg-[#242424]
              text-gray-700
              dark:text-gray-200
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            <ArrowLeft size={20} />

            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className="
            bg-white
            dark:bg-[#1e1e1e]
            rounded-4xl
            shadow-xl
            shadow-gray-200/60
            dark:shadow-black/30
            overflow-hidden
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              bg-yellow-400
              px-6
              py-8
              md:px-10
              md:py-10
              relative
              overflow-hidden
            "
          >
            {/* Decorative Circle */}
            <div
              className="
                absolute
                w-40
                h-40
                rounded-full
                bg-white/10
                -top-16
                -right-10
              "
            />

            <div className="relative z-10">
              {/* Lock Box */}
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-5
                  shadow-md
                "
              >
                <Lock size={28} className="text-yellow-500" />
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold text-white">Change Password</h1>

              {/* Subtitle */}
              <p className="text-white/80 mt-2">
                Keep your account secure with a strong password.
              </p>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleChangePassword} className="p-6 md:p-10">
            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-6
                  px-4
                  py-3
                  rounded-2xl
                  bg-green-50
                  dark:bg-green-500/10
                  text-green-600
                  dark:text-green-400
                "
              >
                <CheckCircle size={20} />

                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-6
                  px-4
                  py-3
                  rounded-2xl
                  bg-red-50
                  dark:bg-red-500/10
                  text-red-600
                  dark:text-red-400
                "
              >
                <XCircle size={20} />

                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* =================================================
                CURRENT PASSWORD
            ================================================= */}

            <div className="mb-5">
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Current Password
              </label>

              <PasswordInput
                value={oldPassword}
                setValue={setOldPassword}
                placeholder="Enter your current password"
                showPassword={showOldPassword}
                setShowPassword={setShowOldPassword}
              />
            </div>

            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <div className="mb-5">
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                New Password
              </label>

              <PasswordInput
                value={newPassword}
                setValue={setNewPassword}
                placeholder="Enter your new password"
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />

              <p className="mt-2 text-xs text-gray-400">
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="mb-7">
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Confirm New Password
              </label>

              <PasswordInput
                value={confirmPassword}
                setValue={setConfirmPassword}
                placeholder="Confirm your new password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
            </div>

            {/* =================================================
                CHANGE PASSWORD BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-3.5
                rounded-2xl
                bg-yellow-400
                hover:bg-yellow-500
                text-white
                font-semibold
                shadow-lg
                transition
                active:scale-[0.98]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock size={19} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
