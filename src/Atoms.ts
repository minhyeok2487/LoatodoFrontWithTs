import { atom } from "recoil";

export interface ModalType {
    openModal: boolean;
    modalTitle: string;
    modalContent: React.ReactNode | null;
}

export const modalState = atom<ModalType>({
    key: 'modalState',
    default: {
        openModal: false,
        modalTitle: '',
        modalContent: null
    }
});