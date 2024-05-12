import { useCallback, useEffect } from "react";
import "../styles/components/Modal.css";
import { useRecoilState } from "recoil";
import { modalState } from "../core/atoms/Modal.atom";

const Modal = () => {
    
  const [modal, setModal] = useRecoilState(modalState);

  const closeModal = () => {
    setModal({ ...modal, openModal: false, modalTitle: '', modalContent: null });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 27 && modal.openModal) {
        // ESC key
        closeModal();
      }
    },
    [modal.openModal, closeModal]
  );

  useEffect(() => {
    const handleKeyDownWrapper = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    const dialog = document.querySelector("dialog");
    if (!dialog) return;

    const handleExternalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      if (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
      ) {
        closeModal();
      }
    };

    if (modal.openModal) {
      dialog.showModal();
      dialog.addEventListener("click", handleExternalClick);
      document.addEventListener("keydown", handleKeyDownWrapper);
    } else {
      dialog.close();
      dialog.removeEventListener("click", handleExternalClick);
      document.removeEventListener("keydown", handleKeyDownWrapper);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDownWrapper);
    };
  }, [modal.openModal, closeModal, handleKeyDown]);

  return (
    <>
      <dialog className="miniModal">
        <div className="modal-title" id="modal-title">
          {modal.modalTitle}
        </div>
        <pre>{modal.modalContent}</pre>
      </dialog>
    </>
  );
};

export default Modal;
