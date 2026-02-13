import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]); // STACK

  const openModal = (component) => {
    setModals((prev) => [...prev, component]); // push new modal
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1)); // remove top modal
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Render ALL modals in stack */}
      {modals.map((ModalComponent, index) => (
        <div key={index} style={{ zIndex: 1000 + index }}>
          {ModalComponent}
        </div>
      ))}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => useContext(ModalContext);
