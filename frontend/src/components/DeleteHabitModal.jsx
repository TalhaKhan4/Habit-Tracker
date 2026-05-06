import Loader from "./Loader.jsx";

function DeleteHabitModal({ onClose, onConfirm, isDeleting, selectedHabit }) {
  return (
    <div
      className="fixed inset-0 z-20 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-[420px] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Are you sure you want to delete this{" "}
          {selectedHabit.type === "one-time todo" ? "todo" : "habit"}?
        </h3>

        {/* Warning text */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          This action will permanently remove the{" "}
          {selectedHabit.type === "one-time todo"
            ? "todo"
            : "habit along with all of its progress and history"}
          . Once deleted, it cannot be recovered.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300  cursor-pointer transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] cursor-pointer"
          >
            {isDeleting ? (
              <Loader
                width="w-5"
                height="h-5"
                border="border-2"
                borderBgColor="border-white border-t-red-300"
              />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteHabitModal;
