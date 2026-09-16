import React, { useState } from "react";
import {
  Link,
  Copy,
  Check,
  X,
  MessageCircle,
  Mail,
  Share2,
} from "lucide-react";

function ShareModal({ shareUrl, note, onClose }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log("Copy Link Error:", error);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `Check out this note: ${shareUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareByEmail = () => {
    const subject = note?.title || "Shared Note";

    const body = `Here is a note I shared with you:\n\n${shareUrl}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const nativeShare = async () => {
    try {
      if (!navigator.share) {
        await copyLink();
        return;
      }

      await navigator.share({
        title: note?.title || "Shared Note",
        text: note?.content || "",
        url: shareUrl,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("Share Error:", error);
      }
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-5next0
        flex items-center justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          border border-gray-200
          bg-white
          p-6
          shadow-2xl
          dark:border-[#3c4043]
          dark:bg-[#303134]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <div
              className="
                mb-3 flex h-11 w-11
                items-center justify-center
                rounded-2xl
                bg-gray-100
                dark:bg-[#3c4043]
              "
            >
              <Share2 size={21} className="text-gray-700 dark:text-gray-200" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Share Note
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Anyone with this link can view this note.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-full
              p-2
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-800
              dark:text-gray-400
              dark:hover:bg-[#3c4043]
              dark:hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Link */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Share link
          </label>

          <div
            className="
              flex items-center gap-2
              rounded-2xl
              border border-gray-200
              bg-gray-50
              p-2
              dark:border-[#3c4043]
              dark:bg-[#202124]
            "
          >
            <Link size={18} className="ml-2 shrink-0 text-gray-400" />

            <input
              type="text"
              value={shareUrl}
              readOnly
              className="
                min-w-0 flex-1
                bg-transparent
                px-1
                py-2
                text-sm
                text-gray-700
                outline-none
                dark:text-gray-200
              "
            />

            <button
              onClick={copyLink}
              className="
                flex shrink-0 items-center gap-2
                rounded-xl
                bg-gray-900
                px-3 py-2
                text-sm font-medium
                text-white
                transition
                hover:bg-gray-700
                dark:bg-white
                dark:text-gray-900
                dark:hover:bg-gray-200
              "
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Options */}

        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Share via
          </p>

          <div className="grid grid-cols-3 gap-3">
            {/* WhatsApp */}

            <button
              onClick={shareOnWhatsApp}
              className="
                flex flex-col items-center
                gap-2
                rounded-2xl
                border border-gray-200
                p-4
                transition
                hover:-translate-y-0.5
                hover:bg-gray-50
                dark:border-[#3c4043]
                dark:hover:bg-[#3c4043]
              "
            >
              <MessageCircle
                size={22}
                className="text-gray-700 dark:text-gray-200"
              />

              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                WhatsApp
              </span>
            </button>

            {/* Email */}

            <button
              onClick={shareByEmail}
              className="
                flex flex-col items-center
                gap-2
                rounded-2xl
                border border-gray-200
                p-4
                transition
                hover:-translate-y-0.5
                hover:bg-gray-50
                dark:border-[#3c4043]
                dark:hover:bg-[#3c4043]
              "
            >
              <Mail size={22} className="text-gray-700 dark:text-gray-200" />

              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Email
              </span>
            </button>

            {/* More */}

            <button
              onClick={nativeShare}
              className="
                flex flex-col items-center
                gap-2
                rounded-2xl
                border border-gray-200
                p-4
                transition
                hover:-translate-y-0.5
                hover:bg-gray-50
                dark:border-[#3c4043]
                dark:hover:bg-[#3c4043]
              "
            >
              <Share2 size={22} className="text-gray-700 dark:text-gray-200" />

              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                More
              </span>
            </button>
          </div>
        </div>

        {/* Close Button */}

        <button
          onClick={onClose}
          className="
            mt-6
            w-full
            rounded-2xl
            border border-gray-200
            px-4 py-3
            text-sm font-medium
            text-gray-700
            transition
            hover:bg-gray-100
            dark:border-[#3c4043]
            dark:text-gray-200
            dark:hover:bg-[#3c4043]
          "
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ShareModal;
