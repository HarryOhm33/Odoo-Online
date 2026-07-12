// src/components/common/ConfirmationModal.jsx
import Modal from "./Modal";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  confirmColor = "red",
  loading = false,
}) => {
  const confirmBtnColor =
    confirmColor === "red"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmBtnColor} disabled:opacity-60`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-red-500/30">
          <FiAlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-slate-300 text-sm leading-relaxed pt-2">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
