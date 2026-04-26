import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  const openModal = (text) => {
    setContent(text);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen:false, content, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook for using modal
export const useModal = () => useContext(ModalContext);
