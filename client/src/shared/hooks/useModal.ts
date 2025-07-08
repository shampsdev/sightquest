import { useContext } from "react";
import { ModalContext } from "../providers/modal-provider";

export const useModal = () => {
  const { setModalOpen, modalOpen } = useContext(ModalContext);

  return {
    setModalOpen,
    modalOpen,
  };
};
