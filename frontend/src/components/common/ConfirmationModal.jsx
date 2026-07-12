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
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
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
        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed pt-2">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
