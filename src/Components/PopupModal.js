import { useState } from "react";
import { useModal } from "./ModalContext";

const PopupModal = () => {
 
    const { isOpen, content, closeModal } = useModal();

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-lg font-semibold">Popup</h2>
        <p className="mt-2 text-gray-700">{content}</p>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupModal;