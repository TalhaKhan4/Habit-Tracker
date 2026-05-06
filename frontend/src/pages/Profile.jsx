import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../features/userSlice.js";
import { IoSendSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const TABS = [
  { id: "info", label: "General Info" },
  { id: "password", label: "Change Password" },
  { id: "feedback", label: "Feedback" },
  { id: "delete", label: "Delete Account" },
];

function Profile() {
  const { fullName, email, memberSince } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");

  const [feedback, setFeedback] = useState({ type: "general", message: "" });
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (!feedback.message.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(feedback),
      });
      setFeedbackStatus(res.ok ? "success" : "error");
      if (res.ok) setFeedback({ type: "general", message: "" });
    } catch {
      setFeedbackStatus("error");
    }
    setTimeout(() => setFeedbackStatus(null), 3500);
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/change-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        },
      );
      if (res.ok) {
        // setPasswordStatus("success");
        toast.success("Password updated successfully!");

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await res.json();
        setPasswordError(data.message || "Failed to update password.");
      }
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    }
    setTimeout(() => setPasswordStatus(null), 3500);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== fullName) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete-account`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        dispatch(logOut());
        navigate("/");
      }
    } catch {
      console.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-white px-10 py-10 max-w-4xl mx-auto">
      {/* ── Top Tab Navigation ── */}
      <div className="flex justify-center gap-1 border-b-2 border-gray-300 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-lg font-black tracking-wide transition-all cursor-pointer relative
              ${
                activeTab === tab.id
                  ? "text-[#252422]"
                  : "text-gray-400 hover:text-gray-600"
              }
              ${tab.id === "delete" && activeTab !== "delete" ? "hover:text-red-400" : ""}
              ${tab.id === "delete" && activeTab === "delete" ? "text-red-500" : ""}
            `}
          >
            {tab.label}
            {/* active underline */}
            {activeTab === tab.id && (
              <span
                className={`absolute bottom-[-2px] left-0 right-0 h-[2.5px] rounded-full ${
                  tab.id === "delete" ? "bg-red-500" : "bg-[#252422]"
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════
          GENERAL INFO
      ══════════════════════════ */}
      {activeTab === "info" && (
        <fieldset className="border-2 border-gray-400 rounded-2xl px-8 pb-8">
          <legend className="px-3 text-sm font-bold text-gray-700 tracking-widest uppercase">
            General Info
          </legend>
          <div className="divide-y divide-gray-100">
            <InfoRow label="Full Name" value={fullName || "—"} />
            <InfoRow label="Email" value={email || "—"} />
            <InfoRow
              label="Member Since"
              value={new Date(memberSince).toLocaleDateString() || "—"}
            />
          </div>
        </fieldset>
      )}

      {/* ══════════════════════════
          CHANGE PASSWORD
      ══════════════════════════ */}
      {activeTab === "password" && (
        <fieldset className="border-2 border-gray-400 rounded-2xl px-8 pb-8">
          <legend className="px-3 text-sm font-bold text-gray-700 tracking-widest uppercase">
            Change Password
          </legend>
          <p className="text-base text-gray-500 mt-1 mb-6">
            Use a strong password that you don't use elsewhere.
          </p>
          <div className="space-y-5">
            <InputField
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(v) =>
                setPasswords((p) => ({ ...p, currentPassword: v }))
              }
              placeholder="Enter current password"
            />
            <InputField
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(v) => setPasswords((p) => ({ ...p, newPassword: v }))}
              placeholder="Enter new password"
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(v) =>
                setPasswords((p) => ({ ...p, confirmPassword: v }))
              }
              placeholder="Confirm new password"
            />

            {passwordError && (
              <p className="text-red-500 text-base font-semibold">
                {passwordError}
              </p>
            )}
            {passwordStatus === "success" && (
              <p className="text-green-600 text-base font-semibold">
                Password updated successfully.
              </p>
            )}

            <button
              onClick={handlePasswordChange}
              className="bg-[#252422] text-white text-base font-bold px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer tracking-wide"
            >
              Update Password
            </button>
          </div>
        </fieldset>
      )}

      {/* ══════════════════════════
          FEEDBACK
      ══════════════════════════ */}
      {activeTab === "feedback" && (
        <fieldset className="border-2 border-gray-200 rounded-2xl px-8 pb-8">
          <legend className="px-3 text-sm font-bold text-gray-400 tracking-widest uppercase">
            Feedback
          </legend>
          <p className="text-base text-gray-500 mt-1 mb-6">
            Have a suggestion or ran into an issue? We'd love to hear from you.
          </p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {["general", "bug", "feature", "other"].map((type) => (
              <button
                key={type}
                onClick={() => setFeedback((f) => ({ ...f, type }))}
                className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase transition-all cursor-pointer
                  ${
                    feedback.type === type
                      ? "bg-blue-500 text-white"
                      : "border-2 border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
              >
                {type === "bug"
                  ? "Bug"
                  : type === "feature"
                    ? "Feature Request"
                    : type === "general"
                      ? "General"
                      : "Other"}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            value={feedback.message}
            onChange={(e) =>
              setFeedback((f) => ({ ...f, message: e.target.value }))
            }
            placeholder="Describe your feedback in detail..."
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-base text-[#252422] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-300"
          />

          {feedbackStatus === "success" && (
            <p className="text-green-600 text-base font-semibold mt-3">
              Your feedback has been submitted. Thank you.
            </p>
          )}
          {feedbackStatus === "error" && (
            <p className="text-red-500 text-base font-semibold mt-3">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            onClick={handleFeedbackSubmit}
            disabled={!feedback.message.trim()}
            className="mt-5 flex items-center gap-2 bg-blue-500 text-white text-base font-bold px-8 py-3.5 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer tracking-wide"
          >
            Send Feedback
            <IoSendSharp size={16} />
          </button>
        </fieldset>
      )}

      {/* ══════════════════════════
          DELETE ACCOUNT
      ══════════════════════════ */}
      {activeTab === "delete" && (
        <fieldset className="border-2 border-red-200 rounded-2xl px-8 pb-8">
          <legend className="px-3 text-sm font-bold text-red-400 tracking-widest uppercase">
            Delete Account
          </legend>
          <p className="text-base text-gray-600 mt-1 mb-6">
            Permanently remove your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white text-base font-bold px-8 py-3.5 rounded-xl hover:bg-red-600 transition-colors cursor-pointer tracking-wide"
          >
            Delete Account
          </button>
        </fieldset>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#252422] mb-3">
              Confirm Account Deletion
            </h2>
            <p className="text-base text-gray-600 mb-5">
              This will permanently erase your account and all your habits. To
              confirm, type your full name:{" "}
              <span className="font-bold text-[#252422]">{fullName}</span>
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type your full name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-[#252422] focus:outline-none focus:ring-2 focus:ring-gray-400 mb-5 placeholder:text-gray-300"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 bg-gray-100 text-[#252422] py-3.5 rounded-xl text-base font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== fullName}
                className="flex-1 bg-red-500 text-white py-3.5 rounded-xl text-base font-bold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-5">
      <span className="text-base font-bold text-gray-500 tracking-wide">
        {label}
      </span>
      <span className="text-base font-bold text-[#252422]">{value}</span>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-base font-bold text-[#252422] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-[#252422] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-300 placeholder:font-normal"
      />
    </div>
  );
}

export default Profile;
