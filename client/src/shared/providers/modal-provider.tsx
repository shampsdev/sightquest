import { ModalCard, ModalCardProps } from "@/components/widgets/modal-card";
import { createContext, useState } from "react";

interface ModalContextInterface {
  modalOpen: ModalOptions;
  setModalOpen: (options: ModalOptions) => void;
}

type ModalOptions = false | ModalCardProps;

export const ModalContext = createContext<ModalContextInterface>({
  modalOpen: false,
  setModalOpen: (options: ModalOptions) => {},
});

export const ModalProvider = ({ children }: { children?: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState<ModalOptions>(false);

  return (
    <ModalContext.Provider value={{ modalOpen, setModalOpen }}>
      {children}
      {modalOpen && <ModalCard {...modalOpen} />}
    </ModalContext.Provider>
  );
};
