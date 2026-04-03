import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* LIGHT BACKDROP (FIXED) */}
      <div
        className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="bg-white rounded-2xl shadow-xl p-6 z-10 w-[90%] max-w-md">

        {/* TITLE */}
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {title}
          </h2>
        )}

        {/* CONTENT */}
        <div className="text-gray-700">{children}</div>

        {/* BUTTON */}
        <button
          className="mt-6 w-full bg-[#5b54d6] hover:bg-[#4c46c7] text-white rounded-lg px-4 py-2 transition"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default Modal;